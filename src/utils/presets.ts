import type { Edge } from '@xyflow/react';
import type { AppNode } from '../store/architectureStore';

export interface ScenarioPreset {
    id: string;
    name: string;
    description: string;
    nodes: AppNode[];
    edges: Edge[];
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
    {
        id: 'blank',
        name: 'Blank Canvas',
        description: 'Start from scratch',
        nodes: [],
        edges: []
    },
    {
        id: 'simple-api',
        name: 'Simple API',
        description: 'Basic Web to API to DB flow',
        nodes: [
            {
                id: 'node-f1',
                type: 'frontend',
                position: { x: 50, y: 150 },
                data: {
                    id: 'node-f1',
                    type: 'frontend',
                    label: 'Mobile App',
                    concurrent_users: 50,
                    requests_per_user_per_second: 1,
                    request_pattern: 'steady'
                }
            },
            {
                id: 'node-g1',
                type: 'gateway',
                position: { x: 300, y: 150 },
                data: {
                    id: 'node-g1',
                    type: 'gateway',
                    label: 'Main API Gateway',
                    rate_limit_rps: 0,
                    auth_overhead_ms: 10
                }
            },
            {
                id: 'node-s1',
                type: 'service',
                position: { x: 550, y: 150 },
                data: {
                    id: 'node-s1',
                    type: 'service',
                    label: 'Users Service',
                    service_type: 'microservice',
                    instances: 2,
                    max_concurrent_requests: 50,
                    avg_processing_time_ms: 30,
                    error_rate_percent: 0
                }
            },
            {
                id: 'node-d1',
                type: 'database',
                position: { x: 800, y: 150 },
                data: {
                    id: 'node-d1',
                    type: 'database',
                    label: 'Primary Postgres',
                    db_type: 'sql',
                    read_latency_ms: 5,
                    write_latency_ms: 20,
                    read_write_ratio: 0.8
                }
            }
        ] as any,
        edges: [
            { id: 'e-f1-g1', source: 'node-f1', target: 'node-g1', animated: true },
            { id: 'e-g1-s1', source: 'node-g1', target: 'node-s1', animated: true },
            { id: 'e-s1-d1', source: 'node-s1', target: 'node-d1', animated: true }
        ]
    },
    {
        id: 'ecommerce-spike',
        name: 'E-Commerce Black Friday',
        description: 'High burst traffic resolving via CDN and Caches',
        nodes: [
            {
                id: 'node-f1',
                type: 'frontend',
                position: { x: 50, y: 250 },
                data: {
                    id: 'node-f1',
                    type: 'frontend',
                    label: 'Global Shoppers',
                    concurrent_users: 1000,
                    requests_per_user_per_second: 2,
                    request_pattern: 'spike',
                    burst_multiplier: 10
                }
            },
            {
                id: 'node-c1',
                type: 'cdn',
                position: { x: 300, y: 100 },
                data: {
                    id: 'node-c1',
                    type: 'cdn',
                    label: 'Cloudflare CDN',
                    cache_hit_rate_percent: 85,
                    edge_latency_ms: 10
                }
            },
            {
                id: 'node-g1',
                type: 'gateway',
                position: { x: 300, y: 350 },
                data: {
                    id: 'node-g1',
                    type: 'gateway',
                    label: 'WAF / Gateway',
                    rate_limit_rps: 5000,
                    auth_overhead_ms: 15
                }
            },
            {
                id: 'node-l1',
                type: 'load_balancer',
                position: { x: 550, y: 350 },
                data: {
                    id: 'node-l1',
                    type: 'load_balancer',
                    label: 'Internal ALB',
                    algorithm: 'round_robin'
                }
            },
            {
                id: 'node-s1',
                type: 'service',
                position: { x: 800, y: 200 },
                data: {
                    id: 'node-s1',
                    type: 'service',
                    label: 'Catalog API',
                    instances: 5,
                    max_concurrent_requests: 200,
                    avg_processing_time_ms: 40,
                    error_rate_percent: 0.1
                }
            },
            {
                id: 'node-s2',
                type: 'service',
                position: { x: 800, y: 500 },
                data: {
                    id: 'node-s2',
                    type: 'service',
                    label: 'Checkout API',
                    instances: 3,
                    max_concurrent_requests: 50,
                    avg_processing_time_ms: 150,
                    error_rate_percent: 1
                }
            },
            {
                id: 'node-redis',
                type: 'cache',
                position: { x: 1050, y: 100 },
                data: {
                    id: 'node-redis',
                    type: 'cache',
                    label: 'Redis Cluster',
                    hit_rate_percent: 90,
                    avg_latency_ms: 2
                }
            },
            {
                id: 'node-q1',
                type: 'queue',
                position: { x: 1050, y: 500 },
                data: {
                    id: 'node-q1',
                    type: 'queue',
                    label: 'Order Queue',
                    max_queue_depth: 50000,
                    consumer_count: 5,
                    consumer_processing_time_ms: 500
                }
            },
            {
                id: 'node-d1',
                type: 'database',
                position: { x: 1300, y: 300 },
                data: {
                    id: 'node-d1',
                    type: 'database',
                    label: 'Master DB',
                    db_type: 'sql',
                    read_latency_ms: 5,
                    write_latency_ms: 30,
                    read_write_ratio: 0.5
                }
            }
        ] as any,
        edges: [
            { id: 'e-f1-c1', source: 'node-f1', target: 'node-c1', animated: true },
            { id: 'e-f1-g1', source: 'node-f1', target: 'node-g1', animated: true },
            { id: 'e-g1-l1', source: 'node-g1', target: 'node-l1', animated: true },
            { id: 'e-l1-s1', source: 'node-l1', target: 'node-s1', animated: true },
            { id: 'e-l1-s2', source: 'node-l1', target: 'node-s2', animated: true },
            { id: 'e-s1-redis', source: 'node-s1', target: 'node-redis', animated: true },
            { id: 'e-s1-d1', source: 'node-s1', target: 'node-d1', animated: true },
            { id: 'e-s2-q1', source: 'node-s2', target: 'node-q1', animated: true },
            { id: 'e-q1-d1', source: 'node-q1', target: 'node-d1', animated: true }
        ]
    },
    {
        id: 'healthy-microservices',
        name: '🟢 Healthy Microservices (Normal operations)',
        description: 'Standard multi-service architecture running smoothly',
        nodes: [
            {
                id: 'node-f1',
                type: 'frontend',
                position: { x: 50, y: 250 },
                data: {
                    id: 'node-f1',
                    type: 'frontend',
                    label: 'Web Traffic',
                    concurrent_users: 200,
                    requests_per_user_per_second: 1.5,
                    request_pattern: 'steady'
                }
            },
            {
                id: 'node-g1',
                type: 'gateway',
                position: { x: 300, y: 250 },
                data: {
                    id: 'node-g1',
                    type: 'gateway',
                    label: 'API Gateway',
                    rate_limit_rps: 1000,
                    auth_overhead_ms: 10
                }
            },
            {
                id: 'node-s-auth',
                type: 'service',
                position: { x: 600, y: 100 },
                data: {
                    id: 'node-s-auth',
                    type: 'service',
                    label: 'Auth Service',
                    instances: 3,
                    max_concurrent_requests: 100,
                    avg_processing_time_ms: 15,
                    error_rate_percent: 0.01
                }
            },
            {
                id: 'node-s-api',
                type: 'service',
                position: { x: 600, y: 400 },
                data: {
                    id: 'node-s-api',
                    type: 'service',
                    label: 'Core API',
                    instances: 4,
                    max_concurrent_requests: 150,
                    avg_processing_time_ms: 40,
                    error_rate_percent: 0.05
                }
            },
            {
                id: 'node-redis',
                type: 'cache',
                position: { x: 900, y: 100 },
                data: {
                    id: 'node-redis',
                    type: 'cache',
                    label: 'Session Cache',
                    hit_rate_percent: 95,
                    avg_latency_ms: 2
                }
            },
            {
                id: 'node-db',
                type: 'database',
                position: { x: 900, y: 400 },
                data: {
                    id: 'node-db',
                    type: 'database',
                    label: 'Main Database',
                    db_type: 'sql',
                    read_latency_ms: 5,
                    write_latency_ms: 15,
                    read_write_ratio: 0.9
                }
            }
        ] as any,
        edges: [
            { id: 'e-1', source: 'node-f1', target: 'node-g1', animated: true },
            { id: 'e-2', source: 'node-g1', target: 'node-s-auth', animated: true },
            { id: 'e-3', source: 'node-g1', target: 'node-s-api', animated: true },
            { id: 'e-4', source: 'node-s-auth', target: 'node-redis', animated: true },
            { id: 'e-5', source: 'node-s-api', target: 'node-db', animated: true }
        ]
    },
    {
        id: 'ddos-attack',
        name: '🔴 DDoS Attack Simulation',
        description: 'Massive traffic spike overwhelming rate limits and resources',
        nodes: [
            {
                id: 'node-botnet',
                type: 'frontend',
                position: { x: 50, y: 150 },
                data: {
                    id: 'node-botnet',
                    type: 'frontend',
                    label: 'Botnet (Attacker)',
                    concurrent_users: 5000,
                    requests_per_user_per_second: 5,
                    request_pattern: 'spike',
                    burst_multiplier: 1
                }
            },
            {
                id: 'node-legit',
                type: 'frontend',
                position: { x: 50, y: 350 },
                data: {
                    id: 'node-legit',
                    type: 'frontend',
                    label: 'Legitimate Users',
                    concurrent_users: 100,
                    requests_per_user_per_second: 1,
                    request_pattern: 'steady'
                }
            },
            {
                id: 'node-waf',
                type: 'gateway',
                position: { x: 350, y: 250 },
                data: {
                    id: 'node-waf',
                    type: 'gateway',
                    label: 'WAF (Struggling)',
                    rate_limit_rps: 5000, // Not low enough to protect backend
                    auth_overhead_ms: 50 // Overhead shoots up under load
                }
            },
            {
                id: 'node-api',
                type: 'service',
                position: { x: 650, y: 250 },
                data: {
                    id: 'node-api',
                    type: 'service',
                    label: 'API Server',
                    instances: 2,
                    max_concurrent_requests: 1000, // allows too many in
                    avg_processing_time_ms: 200, // Slows down
                    error_rate_percent: 5 // errors rise
                }
            },
            {
                id: 'node-db',
                type: 'database',
                position: { x: 950, y: 250 },
                data: {
                    id: 'node-db',
                    type: 'database',
                    label: 'Overloaded DB',
                    db_type: 'sql',
                    read_latency_ms: 500, // Massive latency
                    write_latency_ms: 1000,
                    read_write_ratio: 0.5
                }
            }
        ] as any,
        edges: [
            { id: 'e-1', source: 'node-botnet', target: 'node-waf', animated: true },
            { id: 'e-2', source: 'node-legit', target: 'node-waf', animated: true },
            { id: 'e-3', source: 'node-waf', target: 'node-api', animated: true },
            { id: 'e-4', source: 'node-api', target: 'node-db', animated: true }
        ]
    },
    {
        id: 'db-bottleneck',
        name: '🟠 Database Bottleneck',
        description: 'Frontend is fine, but database locks up causing massive queues',
        nodes: [
            {
                id: 'node-f1',
                type: 'frontend',
                position: { x: 50, y: 200 },
                data: {
                    id: 'node-f1',
                    type: 'frontend',
                    label: 'User Traffic',
                    concurrent_users: 800,
                    requests_per_user_per_second: 2,
                    request_pattern: 'steady'
                }
            },
            {
                id: 'node-lb',
                type: 'load_balancer',
                position: { x: 300, y: 200 },
                data: {
                    id: 'node-lb',
                    type: 'load_balancer',
                    label: 'Load Balancer',
                    algorithm: 'round_robin'
                }
            },
            {
                id: 'node-s1',
                type: 'service',
                position: { x: 600, y: 100 },
                data: {
                    id: 'node-s1',
                    type: 'service',
                    label: 'App Server 1',
                    instances: 5,
                    max_concurrent_requests: 50,
                    avg_processing_time_ms: 50, // fast normally
                    error_rate_percent: 0
                }
            },
            {
                id: 'node-s2',
                type: 'service',
                position: { x: 600, y: 300 },
                data: {
                    id: 'node-s2',
                    type: 'service',
                    label: 'App Server 2',
                    instances: 5,
                    max_concurrent_requests: 50,
                    avg_processing_time_ms: 50,
                    error_rate_percent: 0
                }
            },
            {
                id: 'node-db-slow',
                type: 'database',
                position: { x: 900, y: 200 },
                data: {
                    id: 'node-db-slow',
                    type: 'database',
                    label: 'Locked Database',
                    db_type: 'sql',
                    read_latency_ms: 2000,   // DB is extremely slow
                    write_latency_ms: 5000,
                    read_write_ratio: 0.5
                }
            }
        ] as any,
        edges: [
            { id: 'e-1', source: 'node-f1', target: 'node-lb', animated: true },
            { id: 'e-2', source: 'node-lb', target: 'node-s1', animated: true },
            { id: 'e-3', source: 'node-lb', target: 'node-s2', animated: true },
            { id: 'e-4', source: 'node-s1', target: 'node-db-slow', animated: true },
            { id: 'e-5', source: 'node-s2', target: 'node-db-slow', animated: true }
        ]
    }
];
