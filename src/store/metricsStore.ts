import { create } from 'zustand';
import type { MetricsState, SimulationEvent, SystemMetrics } from '../types/simulation';

interface MetricsStoreState {
    nodeMetrics: MetricsState;
    systemMetrics: SystemMetrics;
    eventLog: SimulationEvent[];

    updateNodeMetrics: (nodeId: string, metrics: Partial<MetricsState[string]>) => void;
    updateSystemMetrics: (metrics: Partial<SystemMetrics>) => void;
    addEvent: (event: Omit<SimulationEvent, 'id' | 'timestamp'>) => void;
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

    clearMetrics: () => set({
        nodeMetrics: {},
        systemMetrics: defaultSystemMetrics,
        eventLog: []
    })
}));
