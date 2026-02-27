import { useSimulationStore } from '../store/simulationStore';
import { useArchitectureStore } from '../store/architectureStore';
import { useMetricsStore } from '../store/metricsStore';
import type { SimulatedRequest } from '../types/simulation';
import type { AllNodeConfigs, FrontendNodeConfig } from '../types/nodes';
import type { Edge } from '@xyflow/react';

// Define structure for keeping internal node simulation state
interface NodeState {
    id: string;
    type: string;
    activeRequests: number;
    queueDepth: number;
    // Metrics accumulator for current tick window (e.g., last 1 sec)
    windowReqs: number;
    windowErrors: number;
    windowLatencySumMs: number;
}

// Extended Request to track node-level state
interface EngineRequest extends SimulatedRequest {
    time_spent_in_current_node_ms: number;
    target_processing_time_ms: number;
}

export class SimulationEngine {
    private timerId: number | null = null;
    private activeRequests: Map<string, EngineRequest> = new Map();
    private nodeStates: Map<string, NodeState> = new Map();

    // Global metrics tracking
    private globalReqs = 0;
    private globalSuccess = 0;
    private globalErrors = 0;
    private latencies: number[] = [];

    start() {
        if (this.timerId !== null) return;
        useSimulationStore.getState().startSimulation();
        this.scheduleNextTick();
    }

    stop() {
        if (this.timerId !== null) {
            window.clearTimeout(this.timerId);
            this.timerId = null;
        }
        useSimulationStore.getState().stopSimulation();
        this.activeRequests.clear();
        this.nodeStates.clear();
        this.globalReqs = 0;
        this.globalSuccess = 0;
        this.globalErrors = 0;
        this.latencies = [];
        useMetricsStore.getState().clearMetrics();
    }

    pause() {
        if (this.timerId !== null) {
            window.clearTimeout(this.timerId);
            this.timerId = null;
        }
        useSimulationStore.getState().pauseSimulation();
    }

    private scheduleNextTick = () => {
        const { isRunning, tickRateMs, speedMultiplier } = useSimulationStore.getState();
        if (!isRunning) return;

        this.tick();

        const delay = tickRateMs / speedMultiplier;
        this.timerId = window.setTimeout(this.scheduleNextTick, delay);
    }

    private getOrCreateNodeState(id: string, type: string): NodeState {
        if (!this.nodeStates.has(id)) {
            this.nodeStates.set(id, {
                id, type, activeRequests: 0, queueDepth: 0,
                windowReqs: 0, windowErrors: 0, windowLatencySumMs: 0
            });
        }
        return this.nodeStates.get(id)!;
    }

    private getOutgoingEdges(nodeId: string, edges: Edge[]): Edge[] {
        return edges.filter(e => e.source === nodeId);
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 10);
    }

    private tick = () => {
        useSimulationStore.getState().incrementTick();

        const { nodes, edges } = useArchitectureStore.getState();
        const { currentTick, tickRateMs } = useSimulationStore.getState();

        // 1. Generate requests from Frontend nodes
        const frontendNodes = nodes.filter(n => n.type === 'frontend');
        for (const fn of frontendNodes) {
            const config = fn.data as FrontendNodeConfig;

            // Calculate requests to generate this tick
            // RPS = concurrent_users * requests_per_user_per_second
            let rps = (config.concurrent_users || 1) * (config.requests_per_user_per_second || 0.1);
            if (config.request_pattern === 'burst' || config.request_pattern === 'spike') {
                // Simple bursting logic: bump RPS if tick is divisible
                if (currentTick % 50 === 0) rps *= (config.burst_multiplier || 5);
            }

            const reqsThisTick = rps * (tickRateMs / 1000);

            // We use probabilistic generation for fractional requests
            const integerReqs = Math.floor(reqsThisTick);
            const fractionalProb = reqsThisTick - integerReqs;
            let actualReqs = integerReqs + (Math.random() < fractionalProb ? 1 : 0);

            const nState = this.getOrCreateNodeState(fn.id, 'frontend');

            for (let i = 0; i < actualReqs; i++) {
                const reqId = this.generateId();
                const req: EngineRequest = {
                    id: reqId,
                    created_at_tick: currentTick,
                    request_type: 'http',
                    current_node_id: fn.id,
                    path_taken: [fn.id],
                    status: 'pending',
                    latency_accumulated_ms: 0,
                    error_reason: null,
                    time_spent_in_current_node_ms: 0,
                    target_processing_time_ms: 2 // base frontend processing
                };

                this.activeRequests.set(reqId, req);
                this.globalReqs++;
                nState.windowReqs++;
            }
        }

        // 2. Process active requests
        for (const [reqId, req] of Array.from(this.activeRequests.entries())) {
            req.latency_accumulated_ms += tickRateMs;
            req.time_spent_in_current_node_ms += tickRateMs;

            const currentNode = nodes.find(n => n.id === req.current_node_id);
            if (!currentNode) {
                req.status = 'failed';
                req.error_reason = 'Node not found';
                this.finishRequest(reqId, req);
                continue;
            }

            // Is processing done at current node?
            if (req.time_spent_in_current_node_ms >= req.target_processing_time_ms) {
                // Done with current node. Move to next!
                const outgoing = this.getOutgoingEdges(currentNode.id, edges);

                if (outgoing.length === 0) {
                    // Reached end of line!
                    req.status = 'completed';
                    this.finishRequest(reqId, req);
                } else {
                    // Pick next node
                    // For Load Balancer, we'd use algorithm. For others, simple random or broadcast.
                    // Doing Random Choice across standard edges
                    const nextEdge = outgoing[Math.floor(Math.random() * outgoing.length)];
                    this.transitionRequestToNode(req, nextEdge.target, nodes);
                }
            } else {
                req.status = 'processing';
            }
        }

        // periodic metrics flush (every 1 second = 1000ms / tickRateMs ticks)
        if (currentTick % Math.max(1, Math.floor(1000 / tickRateMs)) === 0) {
            this.flushMetrics();
        }
    }

    private transitionRequestToNode(req: EngineRequest, nextNodeId: string, nodes: any[]) {
        const nextNode = nodes.find(n => n.id === nextNodeId);
        if (!nextNode) {
            req.status = 'failed';
            this.finishRequest(req.id, req);
            return;
        }

        req.current_node_id = nextNodeId;
        req.path_taken.push(nextNodeId);
        req.time_spent_in_current_node_ms = 0;

        const config = nextNode.data as AllNodeConfigs;
        const nState = this.getOrCreateNodeState(nextNodeId, config.type);
        nState.windowReqs++;

        // Determine target processing time based on Node Type and simulate constraints
        switch (config.type) {
            case 'gateway':
                // Check rate limit
                if (config.rate_limit_rps > 0 && nState.windowReqs > config.rate_limit_rps) {
                    req.status = 'dropped';
                    nState.windowErrors++;
                    this.finishRequest(req.id, req);
                    return;
                }
                req.target_processing_time_ms = (config.auth_overhead_ms || 10) + (config.ssl_overhead_ms || 20);
                break;
            case 'load_balancer':
                req.target_processing_time_ms = 2; // tiny routing delay
                break;
            case 'service':
                // Max Concurrent Check
                const capacity = (config.instances || 1) * (config.max_concurrent_requests || 100);
                if (nState.activeRequests >= capacity) {
                    // queue it or drop it
                    const queueCapacity = capacity * 2;
                    if (nState.queueDepth >= queueCapacity) {
                        req.status = 'dropped';
                        nState.windowErrors++;
                        this.finishRequest(req.id, req);
                        return;
                    }
                    nState.queueDepth++;
                    // Adds massive delay if queued
                    req.target_processing_time_ms = (config.avg_processing_time_ms || 50) * 10;
                } else {
                    nState.activeRequests++;
                    req.target_processing_time_ms = config.avg_processing_time_ms || 50;
                }
                // Random Error Simulation
                if (config.error_rate_percent > 0 && Math.random() < config.error_rate_percent / 100) {
                    req.status = 'failed';
                    nState.windowErrors++;
                    this.finishRequest(req.id, req);
                    return;
                }
                break;
            case 'database':
                // Simulated lock contention and IO latency
                if (Math.random() < (config.read_write_ratio || 0.8)) {
                    req.target_processing_time_ms = config.read_latency_ms || 5;
                } else {
                    req.target_processing_time_ms = config.write_latency_ms || 20;
                }
                break;
            case 'cache':
                if (Math.random() < (config.hit_rate_percent || 90) / 100) {
                    req.target_processing_time_ms = config.avg_latency_ms || 1; // Instant hit
                } else {
                    req.target_processing_time_ms = 50; // Cache miss delay
                }
                break;
            case 'queue':
                if (nState.queueDepth > (config.max_queue_depth || 1000)) {
                    req.status = 'dropped';
                    this.finishRequest(req.id, req);
                    return;
                }
                req.target_processing_time_ms = config.consumer_processing_time_ms || 10;
                break;
            case 'cdn':
                if (Math.random() < (config.cache_hit_rate_percent || 80) / 100) {
                    // Delivered by CDN and stop processing
                    req.target_processing_time_ms = config.edge_latency_ms || 10;
                    req.status = 'completed';
                    // Don't finish yet, let it tick down
                } else {
                    req.target_processing_time_ms = 5; // Forward delay
                }
                break;
            default:
                req.target_processing_time_ms = 10;
        }

    }

    private finishRequest(reqId: string, req: EngineRequest) {
        if (req.status === 'completed') {
            this.globalSuccess++;
            this.latencies.push(req.latency_accumulated_ms);
            // Cap history
            if (this.latencies.length > 500) {
                this.latencies.shift();
            }
        } else {
            this.globalErrors++;
        }

        // Clean up node states
        const nState = this.nodeStates.get(req.current_node_id);
        if (nState) {
            if (nState.activeRequests > 0) nState.activeRequests--;
            nState.windowLatencySumMs += req.latency_accumulated_ms;
        }

        this.activeRequests.delete(reqId);
    }

    private flushMetrics() {
        const store = useMetricsStore.getState();

        // System metrics
        this.latencies.sort((a, b) => a - b);
        const p50 = this.latencies.length > 0 ? this.latencies[Math.floor(this.latencies.length * 0.50)] : 0;
        const p95 = this.latencies.length > 0 ? this.latencies[Math.floor(this.latencies.length * 0.95)] : 0;
        const p99 = this.latencies.length > 0 ? this.latencies[Math.floor(this.latencies.length * 0.99)] : 0;

        const successRate = this.globalReqs > 0 ? (this.globalSuccess / this.globalReqs) * 100 : 100;

        store.updateSystemMetrics({
            total_rps: this.activeRequests.size, // active concurrent as proxy, or true RPS window
            success_rate_percent: successRate,
            p50_latency_ms: p50,
            p95_latency_ms: p95,
            p99_latency_ms: p99,
            total_active_requests: this.activeRequests.size
        });

        // Global health calculation
        const health = successRate;
        useSimulationStore.setState({ globalHealthScore: health });

        // Node metrics
        for (const [id, nState] of Array.from(this.nodeStates.entries())) {
            const avgL = nState.windowReqs > 0 ? nState.windowLatencySumMs / nState.windowReqs : 0;
            const errR = nState.windowReqs > 0 ? (nState.windowErrors / nState.windowReqs) * 100 : 0;

            let status: 'healthy' | 'degraded' | 'critical' | 'down' = 'healthy';
            if (errR > 50) status = 'down';
            else if (errR > 10) status = 'critical';
            else if (errR > 0 || avgL > 1000) status = 'degraded';

            store.updateNodeMetrics(id, {
                rps: nState.windowReqs,
                latency_avg_ms: avgL,
                error_rate_percent: errR,
                active_requests: nState.activeRequests,
                queue_depth: nState.queueDepth,
                status
            });

            // reset window
            nState.windowReqs = 0;
            nState.windowErrors = 0;
            nState.windowLatencySumMs = 0;
            // queue drain simulation
            if (nState.queueDepth > 0) nState.queueDepth = Math.max(0, nState.queueDepth - 10);
        }
    }
}

// Singleton instance
export const engine = new SimulationEngine();
