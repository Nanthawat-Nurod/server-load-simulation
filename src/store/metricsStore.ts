import { create } from 'zustand';
import type { MetricsState, SimulationEvent, SystemMetrics } from '../types/simulation';

interface MetricsStoreState {
    nodeMetrics: MetricsState;
    systemMetrics: SystemMetrics;
    eventLog: SimulationEvent[];

    updateNodeMetrics: (nodeId: string, metrics: Partial<MetricsState[string]>) => void;
    updateSystemMetrics: (metrics: Partial<SystemMetrics>) => void;
    addEvent: (event: Omit<SimulationEvent, 'id' | 'timestamp'>) => void;
    recordHistoryTick: (tick: number) => void;
    clearMetrics: () => void;
}

const defaultSystemMetrics: SystemMetrics = {
    total_rps: 0,
    success_rate_percent: 100,
    p50_latency_ms: 0,
    p95_latency_ms: 0,
    p99_latency_ms: 0,
    total_active_requests: 0,
};

export const useMetricsStore = create<MetricsStoreState>((set) => ({
    nodeMetrics: {},
    systemMetrics: defaultSystemMetrics,
    eventLog: [],

    updateNodeMetrics: (nodeId, metrics) => set((state) => ({
        nodeMetrics: {
            ...state.nodeMetrics,
            [nodeId]: {
                ...(state.nodeMetrics[nodeId] || {
                    rps: 0,
                    latency_avg_ms: 0,
                    error_rate_percent: 0,
                    active_requests: 0,
                    status: 'healthy'
                }),
                ...metrics
            }
        }
    })),

    updateSystemMetrics: (metrics) => set((state) => ({
        systemMetrics: { ...state.systemMetrics, ...metrics }
    })),

    addEvent: (event) => set((state) => ({
        eventLog: [
            {
                ...event,
                id: Math.random().toString(36).substring(2, 9),
                timestamp: Date.now()
            },
            ...state.eventLog
        ].slice(0, 100) // Keep last 100 events
    })),

    recordHistoryTick: (tick: number) => set((state) => {
        const nextNodeMetrics = { ...state.nodeMetrics };
        Object.keys(nextNodeMetrics).forEach(id => {
            const current = nextNodeMetrics[id];
            const newHistoryItem = {
                tick,
                rps: current.rps,
                latency: current.latency_avg_ms,
                active_requests: current.active_requests,
                cpu: current.cpu_usage_percent || 0
            };
            const currentHistory = current.history || [];
            nextNodeMetrics[id] = {
                ...current,
                history: [...currentHistory, newHistoryItem].slice(-60) // Keep last 60 ticks (e.g. 60 seconds if 1 tick = 1s)
            };
        });
        return { nodeMetrics: nextNodeMetrics };
    }),

    clearMetrics: () => set({
        nodeMetrics: {},
        systemMetrics: defaultSystemMetrics,
        eventLog: []
    })
}));
