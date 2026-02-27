import type { AppNode } from '../store/architectureStore';
import type { AllNodeConfigs } from '../types/nodes';

export function calculateNodeCostMonthly(node: AppNode): number {
    const data = node.data as AllNodeConfigs;

    switch (data.type) {
        case 'frontend':
            return 0; // Traffic generators don't cost infrastructure

        case 'gateway':
            return 20 + (data.rate_limit_rps > 0 ? 5 : 0) + (data.enable_circuit_breaker ? 5 : 0);

        case 'load_balancer':
            return 18;

        case 'service': {
            // Basic math: $10 per CPU core, $5 per GB RAM per instance
            const cpuCost = (data.cpu_cores || 1) * 10;
            const ramCost = (data.memory_gb || 1) * 5;
            const totalInstanceCost = cpuCost + ramCost;
            return (data.instances || 1) * totalInstanceCost;
        }

        case 'database': {
            // Base DB cost + capacity scaling
            let base = 50;
            if (data.db_type === 'in_memory') base = 30;
            else if (data.db_type === 'nosql') base = 40;

            const poolCost = (data.connection_pool_size || 100) * 0.05;
            return base + poolCost;
        }

        case 'cache':
            // e.g. $0.05 per MB
            return (data.capacity_mb || 256) * 0.05;

        case 'queue':
            // Base + consumer compute cost + depth storage cost
            return 15 + ((data.consumer_count || 1) * 5) + ((data.max_queue_depth || 1000) / 1000 * 0.5);

        case 'cdn':
            // Flat base cost for CDN
            return 25;

        default:
            return 0;
    }
}

export function calculateTotalArchitectureCost(nodes: AppNode[]): number {
    return nodes.reduce((total, node) => total + calculateNodeCostMonthly(node), 0);
}
