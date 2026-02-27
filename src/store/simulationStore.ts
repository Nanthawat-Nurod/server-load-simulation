import { create } from 'zustand';

interface SimulationState {
    isRunning: boolean;
    tickRateMs: number;
    speedMultiplier: number; // 1x, 2x, 5x, 10x
    currentTick: number;
    elapsedTimeMs: number;
    globalHealthScore: number;

    startSimulation: () => void;
    pauseSimulation: () => void;
    stopSimulation: () => void;
    setSpeed: (speed: number) => void;
    setTickRate: (rate: number) => void;
    incrementTick: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
    isRunning: false,
    tickRateMs: 100, // 100ms per tick
    speedMultiplier: 1,
    currentTick: 0,
    elapsedTimeMs: 0,
    globalHealthScore: 100,

    startSimulation: () => set({ isRunning: true }),
    pauseSimulation: () => set({ isRunning: false }),
    stopSimulation: () => set({
        isRunning: false,
        currentTick: 0,
        elapsedTimeMs: 0,
        globalHealthScore: 100
    }),
    setSpeed: (speed: number) => set({ speedMultiplier: speed }),
    setTickRate: (rate: number) => set({ tickRateMs: rate }),

    incrementTick: () => set(state => ({
        currentTick: state.currentTick + 1,
        elapsedTimeMs: state.elapsedTimeMs + state.tickRateMs
    })),
}));
