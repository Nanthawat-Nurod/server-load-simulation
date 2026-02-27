export type RequestStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'timeout'
    | 'dropped';

export interface SimulatedRequest {
    id: string;
    created_at_tick: number;
    request_type: string;
    current_node_id: string;
    path_taken: string[]; // array of node_ids
    status: RequestStatus;
    latency_accumulated_ms: number;
    error_reason: string | null;
}

export type EventType = 'info' | 'warning' | 'error' | 'recovery';

export interface SimulationEvent {
    id: string;
    timestamp: number;
    tick: number;
    node_id: string;
    node_name: string;
    type: EventType;
    message: string;
}

export interface NodeMetrics {
    rps: number;
    latency_avg_ms: number;
    error_rate_percent: number;
    cpu_usage_percent?: number;
    memory_usage_percent?: number;
    queue_depth?: number;
    instance_count?: number;
    active_requests: number;
    status: 'healthy' | 'degraded' | 'critical' | 'down';
}

export interface SystemMetrics {
    total_rps: number;
    success_rate_percent: number;
    p50_latency_ms: number;
    p95_latency_ms: number;
    p99_latency_ms: number;
    total_active_requests: number;
}

// Map of node_id to its current metrics
export type MetricsState = Record<string, NodeMetrics>;

export interface SimulationState {
    isRunning: boolean;
    tickRateMs: number;
    speedMultiplier: number; // 1x, 2x, 5x, 10x
    currentTick: number;
    elapsedTimeMs: number;
    globalHealthScore: number; // 0-100
}
