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
        ]
    },
    {
        id: 'cdn-failure',
        name: '🔴 CDN Failure / Cache Bypass',
        description: 'CDN is completely missing cache, flooding the backend WAF and Services',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 150 },
                data: { id: 'n-f1', type: 'frontend', label: 'Global Traffic', concurrent_users: 2000, requests_per_user_per_second: 3, request_pattern: 'steady' }
            },
            {
                id: 'n-c1', type: 'cdn', position: { x: 300, y: 150 },
                data: { id: 'n-c1', type: 'cdn', label: 'Bypassed CDN', cache_hit_rate_percent: 0, edge_latency_ms: 500 } // Error CDN
            },
            {
                id: 'n-g1', type: 'gateway', position: { x: 550, y: 150 },
                data: { id: 'n-g1', type: 'gateway', label: 'Main WAF', rate_limit_rps: 3000, auth_overhead_ms: 20 }
            },
            {
                id: 'n-s1', type: 'service', position: { x: 800, y: 150 },
                data: { id: 'n-s1', type: 'service', label: 'Media Service', instances: 2, max_concurrent_requests: 100, avg_processing_time_ms: 100, error_rate_percent: 0 }
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-c1', animated: true },
            { id: 'e2', source: 'n-c1', target: 'n-g1', animated: true },
            { id: 'e3', source: 'n-g1', target: 'n-s1', animated: true }
        ]
    },
    {
        id: 'retry-storm',
        name: '🔴 Retry Storm (Gateway Loop)',
        description: 'Backend is slightly unstable, but Gateway retries aggressively, multiplying load',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 150 },
                data: { id: 'n-f1', type: 'frontend', label: 'Mobile Clients', concurrent_users: 500, requests_per_user_per_second: 1, request_pattern: 'steady' }
            },
            {
                id: 'n-g1', type: 'gateway', position: { x: 300, y: 150 },
                data: { id: 'n-g1', type: 'gateway', label: 'Aggressive Gateway', rate_limit_rps: 10000, auth_overhead_ms: 10, retry_attempts: 5, retry_delay_ms: 50 } // Multiple retries
            },
            {
                id: 'n-s1', type: 'service', position: { x: 600, y: 150 },
                data: { id: 'n-s1', type: 'service', label: 'Flaky Service', instances: 3, max_concurrent_requests: 200, avg_processing_time_ms: 50, error_rate_percent: 40 } // High error rate causing retries
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-g1', animated: true },
            { id: 'e2', source: 'n-g1', target: 'n-s1', animated: true }
        ]
    },
    {
        id: 'queue-backlog',
        name: '🟠 Message Queue Backlog',
        description: 'Producers are fast, but consumers are extremely slow causing infinite queue pooling',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 150 },
                data: { id: 'n-f1', type: 'frontend', label: 'IoT Devices', concurrent_users: 500, requests_per_user_per_second: 5, request_pattern: 'steady' }
            },
            {
                id: 'n-g1', type: 'gateway', position: { x: 300, y: 150 },
                data: { id: 'n-g1', type: 'gateway', label: 'Ingest Gateway', rate_limit_rps: 5000, auth_overhead_ms: 5 }
            },
            {
                id: 'n-s1', type: 'service', position: { x: 600, y: 150 },
                data: { id: 'n-s1', type: 'service', label: 'Producer API', instances: 5, max_concurrent_requests: 1000, avg_processing_time_ms: 10, error_rate_percent: 0 }
            },
            {
                id: 'n-q1', type: 'queue', position: { x: 900, y: 150 },
                data: { id: 'n-q1', type: 'queue', label: 'Kafka Topic', max_queue_depth: 100000, consumer_count: 1, consumer_processing_time_ms: 500 } // Super slow consumer
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-g1', animated: true },
            { id: 'e2', source: 'n-g1', target: 'n-s1', animated: true },
            { id: 'e3', source: 'n-s1', target: 'n-q1', animated: true }
        ]
    },
    {
        id: 'gateway-rate-limit',
        name: '🟠 Strict Rate Limiting',
        description: 'Strict API Gateway blocks most traffic, saving the backend but annoying users',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 150 },
                data: { id: 'n-f1', type: 'frontend', label: 'Public Traffic', concurrent_users: 1000, requests_per_user_per_second: 2, request_pattern: 'spike' }
            },
            {
                id: 'n-g1', type: 'gateway', position: { x: 350, y: 150 },
                data: { id: 'n-g1', type: 'gateway', label: 'Strict WAF', rate_limit_rps: 200, auth_overhead_ms: 10, rate_limit_strategy: 'reject' } // Blocks everything above 200 RPS
            },
            {
                id: 'n-s1', type: 'service', position: { x: 650, y: 150 },
                data: { id: 'n-s1', type: 'service', label: 'Protected API', instances: 2, max_concurrent_requests: 100, avg_processing_time_ms: 50, error_rate_percent: 0 }
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-g1', animated: true },
            { id: 'e2', source: 'n-g1', target: 'n-s1', animated: true }
        ]
    },
    {
        id: 'memory-leak',
        name: '🔴 Under-provisioned Service (Memory Leak)',
        description: 'The service is severely under-provisioned and gets overwhelmed immediately',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 150 },
                data: { id: 'n-f1', type: 'frontend', label: 'Normal Traffic', concurrent_users: 300, requests_per_user_per_second: 1, request_pattern: 'steady' }
            },
            {
                id: 'n-s1', type: 'service', position: { x: 350, y: 150 },
                data: { id: 'n-s1', type: 'service', label: 'Dying Legacy App', instances: 1, max_concurrent_requests: 20, avg_processing_time_ms: 2000, error_rate_percent: 20 } // Barely works
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-s1', animated: true }
        ]
    },
    {
        id: 'multi-region-ha',
        name: '🟢 Multi-Region High Availability',
        description: 'Traffic perfectly distributed across US and EU datacenters',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 100 },
                data: { id: 'n-f1', type: 'frontend', label: 'US Users', concurrent_users: 200, requests_per_user_per_second: 1, request_pattern: 'steady' }
            },
            {
                id: 'n-f2', type: 'frontend', position: { x: 50, y: 400 },
                data: { id: 'n-f2', type: 'frontend', label: 'EU Users', concurrent_users: 200, requests_per_user_per_second: 1, request_pattern: 'steady' }
            },
            {
                id: 'n-g1', type: 'gateway', position: { x: 300, y: 100 },
                data: { id: 'n-g1', type: 'gateway', label: 'US-East ALB', rate_limit_rps: 5000, auth_overhead_ms: 10 }
            },
            {
                id: 'n-g2', type: 'gateway', position: { x: 300, y: 400 },
                data: { id: 'n-g2', type: 'gateway', label: 'EU-West ALB', rate_limit_rps: 5000, auth_overhead_ms: 10 }
            },
            {
                id: 'n-s1', type: 'service', position: { x: 600, y: 50 },
                data: { id: 'n-s1', type: 'service', label: 'US Web Servers', instances: 5, max_concurrent_requests: 100, avg_processing_time_ms: 30, error_rate_percent: 0 }
            },
            {
                id: 'n-s2', type: 'service', position: { x: 600, y: 450 },
                data: { id: 'n-s2', type: 'service', label: 'EU Web Servers', instances: 5, max_concurrent_requests: 100, avg_processing_time_ms: 30, error_rate_percent: 0 }
            },
            {
                id: 'n-db', type: 'database', position: { x: 900, y: 250 },
                data: { id: 'n-db', type: 'database', label: 'Global DB Cluster', db_type: 'sql', read_latency_ms: 5, write_latency_ms: 15, read_write_ratio: 0.9 }
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-g1', animated: true },
            { id: 'e2', source: 'n-f2', target: 'n-g2', animated: true },
            { id: 'e3', source: 'n-g1', target: 'n-s1', animated: true },
            { id: 'e4', source: 'n-g2', target: 'n-s2', animated: true },
            { id: 'e5', source: 'n-s1', target: 'n-db', animated: true },
            { id: 'e6', source: 'n-s2', target: 'n-db', animated: true }
        ]
    },
    {
        id: 'cache-stampede',
        name: '🔴 Cache Stampede (Thundering Herd)',
        description: 'Cache completely fails, routing all traffic simultaneously to a weak Database',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 200 },
                data: { id: 'n-f1', type: 'frontend', label: 'Sudden Viral Spike', concurrent_users: 3000, requests_per_user_per_second: 2, request_pattern: 'spike', burst_multiplier: 5 }
            },
            {
                id: 'n-s1', type: 'service', position: { x: 350, y: 200 },
                data: { id: 'n-s1', type: 'service', label: 'API Handler', instances: 10, max_concurrent_requests: 500, avg_processing_time_ms: 20, error_rate_percent: 0 }
            },
            {
                id: 'n-c1', type: 'cache', position: { x: 650, y: 100 },
                data: { id: 'n-c1', type: 'cache', label: 'Dead Memcached', hit_rate_percent: 5, avg_latency_ms: 200 } // Dead cache
            },
            {
                id: 'n-db1', type: 'database', position: { x: 650, y: 350 },
                data: { id: 'n-db1', type: 'database', label: 'Vulnerable DB', db_type: 'sql', read_latency_ms: 80, write_latency_ms: 100, read_write_ratio: 0.9 }
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-s1', animated: true },
            { id: 'e2', source: 'n-s1', target: 'n-c1', animated: true },
            { id: 'e3', source: 'n-s1', target: 'n-db1', animated: true }
        ]
    },
    {
        id: 'perfect-caching',
        name: '🟢 Perfect Caching Layer',
        description: '99% Cache Hit Rate completely shields the Database from heavy loads',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 150 },
                data: { id: 'n-f1', type: 'frontend', label: 'Heavy Readers', concurrent_users: 1000, requests_per_user_per_second: 3, request_pattern: 'steady' }
            },
            {
                id: 'n-s1', type: 'service', position: { x: 300, y: 150 },
                data: { id: 'n-s1', type: 'service', label: 'Read API', instances: 5, max_concurrent_requests: 200, avg_processing_time_ms: 10, error_rate_percent: 0 }
            },
            {
                id: 'n-c1', type: 'cache', position: { x: 600, y: 150 },
                data: { id: 'n-c1', type: 'cache', label: 'Solid Redis', hit_rate_percent: 99, avg_latency_ms: 1 } // God tier cache
            },
            {
                id: 'n-db1', type: 'database', position: { x: 900, y: 150 },
                data: { id: 'n-db1', type: 'database', label: 'Sleepy DB', db_type: 'sql', read_latency_ms: 10, write_latency_ms: 20, read_write_ratio: 0.9 }
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-s1', animated: true },
            { id: 'e2', source: 'n-s1', target: 'n-c1', animated: true },
            { id: 'e3', source: 'n-c1', target: 'n-db1', animated: true }
        ]
    },
    {
        id: 'microservice-chain',
        name: '🟠 Deep Microservice Chain Delay',
        description: 'Long chain of interconnected services multiplying total latency',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 150 },
                data: { id: 'n-f1', type: 'frontend', label: 'Web UI', concurrent_users: 100, requests_per_user_per_second: 1, request_pattern: 'steady' }
            },
            {
                id: 'n-s1', type: 'service', position: { x: 250, y: 150 },
                data: { id: 'n-s1', type: 'service', label: 'API Gateway Svc', instances: 3, max_concurrent_requests: 100, avg_processing_time_ms: 20, error_rate_percent: 0 }
            },
            {
                id: 'n-s2', type: 'service', position: { x: 450, y: 150 },
                data: { id: 'n-s2', type: 'service', label: 'Aggregator Svc', instances: 3, max_concurrent_requests: 100, avg_processing_time_ms: 30, error_rate_percent: 0 }
            },
            {
                id: 'n-s3', type: 'service', position: { x: 650, y: 150 },
                data: { id: 'n-s3', type: 'service', label: 'Business Logic Svc', instances: 3, max_concurrent_requests: 100, avg_processing_time_ms: 40, error_rate_percent: 0 }
            },
            {
                id: 'n-s4', type: 'service', position: { x: 850, y: 150 },
                data: { id: 'n-s4', type: 'service', label: 'Data Access Svc', instances: 3, max_concurrent_requests: 100, avg_processing_time_ms: 20, error_rate_percent: 0 }
            },
            {
                id: 'n-db', type: 'database', position: { x: 1050, y: 150 },
                data: { id: 'n-db', type: 'database', label: 'Database', db_type: 'sql', read_latency_ms: 10, write_latency_ms: 20, read_write_ratio: 0.8 }
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-s1', animated: true },
            { id: 'e2', source: 'n-s1', target: 'n-s2', animated: true },
            { id: 'e3', source: 'n-s2', target: 'n-s3', animated: true },
            { id: 'e4', source: 'n-s3', target: 'n-s4', animated: true },
            { id: 'e5', source: 'n-s4', target: 'n-db', animated: true }
        ]
    },
    {
        id: 'asynchronous-email',
        name: '🟢 Event-Driven (Asynchronous Workers)',
        description: 'Fast API response while heavy tasks are offloaded to queue consumers',
        nodes: [
            {
                id: 'n-f1', type: 'frontend', position: { x: 50, y: 150 },
                data: { id: 'n-f1', type: 'frontend', label: 'User Signups', concurrent_users: 150, requests_per_user_per_second: 2, request_pattern: 'steady' }
            },
            {
                id: 'n-s1', type: 'service', position: { x: 300, y: 150 },
                data: { id: 'n-s1', type: 'service', label: 'Fast Web API', instances: 4, max_concurrent_requests: 500, avg_processing_time_ms: 15, error_rate_percent: 0 }
            },
            {
                id: 'n-db', type: 'database', position: { x: 600, y: 50 },
                data: { id: 'n-db', type: 'database', label: 'User DB', db_type: 'sql', read_latency_ms: 5, write_latency_ms: 10, read_write_ratio: 0.5 }
            },
            {
                id: 'n-q1', type: 'queue', position: { x: 600, y: 250 },
                data: { id: 'n-q1', type: 'queue', label: 'Email Jobs', max_queue_depth: 10000, consumer_count: 5, consumer_processing_time_ms: 200 }
            }
        ] as any,
        edges: [
            { id: 'e1', source: 'n-f1', target: 'n-s1', animated: true },
            { id: 'e2', source: 'n-s1', target: 'n-db', animated: true },
            { id: 'e3', source: 'n-s1', target: 'n-q1', animated: true }
        ]
    }
];
