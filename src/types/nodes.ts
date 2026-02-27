// Node Types and Configurations

export type NodeType =
    | 'frontend'
    | 'gateway'
    | 'load_balancer'
    | 'service'
    | 'database'
    | 'cache'
    | 'queue'
    | 'cdn';

export type BaseNodeData = Record<string, unknown> & {
    id: string;
    type: NodeType;
    label: string;
};

// ─────────────────────────────────────────
// NODE 1: Frontend Client
// ─────────────────────────────────────────
export interface RequestTypeWeight {
    name: string;
    weight_percent: number;
    payload_size_kb: number;
}

export interface FrontendNodeConfig extends BaseNodeData {
    type: 'frontend';
    concurrent_users: number; // 1 - 1,000,000
    requests_per_user_per_second: number; // 0.1 - 100
    request_pattern: 'steady' | 'burst' | 'ramp_up' | 'wave' | 'spike';
    burst_multiplier?: number; // 1x - 100x
    burst_duration_seconds?: number;
    think_time_ms: number;
    request_types: RequestTypeWeight[];
}

// ─────────────────────────────────────────
// NODE 2: API Gateway
// ─────────────────────────────────────────
export interface RoutingRule {
    path_prefix: string;
    target_service_id: string; // Connection to next node
    weight_percent: number;
}

export interface GatewayNodeConfig extends BaseNodeData {
    type: 'gateway';
    rate_limit_rps: number; // 0 = unlimited
    rate_limit_strategy: 'reject' | 'queue' | 'throttle';
    timeout_ms: number;
    retry_attempts: number; // 0-5
    retry_delay_ms: number;
    auth_overhead_ms: number;
    ssl_overhead_ms: number;
    routing_rules: RoutingRule[];
    enable_circuit_breaker: boolean;
    circuit_breaker_threshold_percent: number;
    circuit_breaker_cooldown_seconds: number;
}

// ─────────────────────────────────────────
// NODE 3: Load Balancer
// ─────────────────────────────────────────
export interface LoadBalancerNodeConfig extends BaseNodeData {
    type: 'load_balancer';
    algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'ip_hash' | 'random';
    health_check_interval_ms: number;
    health_check_timeout_ms: number;
    sticky_sessions: boolean;
    connection_draining_seconds: number;
}

// ─────────────────────────────────────────
// NODE 4: Service
// ─────────────────────────────────────────
export interface AutoScalingConfig {
    enabled: boolean;
    min_instances: number;
    max_instances: number;
    scale_up_cpu_threshold: number; // percent
    scale_up_queue_threshold: number; // queue depth
    scale_down_cpu_threshold: number;
    cooldown_seconds: number;
    scale_up_increment: number;
}

export interface ServiceNodeConfig extends BaseNodeData {
    type: 'service';
    service_name: string;
    service_type: 'monolith' | 'microservice' | 'serverless_function';
    instances: number; // 1-20
    cpu_cores: number; // 0.5, 1, 2, 4, 8, 16
    memory_gb: number; // 0.5, 1, 2, 4, 8, 16, 32
    max_concurrent_requests: number; // per instance
    avg_processing_time_ms: number; // base processing time
    processing_time_variance_percent: number;
    error_rate_percent: number; // base random error rate
    startup_time_ms: number; // time for new instance to be ready
    auto_scaling: AutoScalingConfig;
    dependencies: string[]; // target node ids
}

// ─────────────────────────────────────────
// NODE 5: Database
// ─────────────────────────────────────────
export interface DatabaseNodeConfig extends BaseNodeData {
    type: 'database';
    db_type: 'sql' | 'nosql' | 'in_memory';
    max_connections: number;
    connection_pool_size: number;
    read_latency_ms: number;
    write_latency_ms: number;
    read_write_ratio: number;
    replication: 'none' | 'read_replica' | 'master_slave';
    replica_count: number;
    max_iops: number;
    storage_gb: number;
}

// ─────────────────────────────────────────
// NODE 6: Cache
// ─────────────────────────────────────────
export interface CacheNodeConfig extends BaseNodeData {
    type: 'cache';
    cache_type: 'in_memory' | 'distributed';
    hit_rate_percent: number;
    capacity_mb: number;
    eviction_policy: 'lru' | 'lfu' | 'ttl' | 'none';
    avg_latency_ms: number;
    max_connections: number;
}

// ─────────────────────────────────────────
// NODE 7: Message Queue
// ─────────────────────────────────────────
export interface QueueNodeConfig extends BaseNodeData {
    type: 'queue';
    queue_type: 'rabbitmq' | 'kafka' | 'sqs_like';
    max_queue_depth: number;
    consumer_count: number;
    consumer_processing_time_ms: number;
    message_ttl_seconds: number;
    delivery_guarantee: 'at_most_once' | 'at_least_once' | 'exactly_once';
}

// ─────────────────────────────────────────
// NODE 8: CDN
// ─────────────────────────────────────────
export interface CdnNodeConfig extends BaseNodeData {
    type: 'cdn';
    cache_hit_rate_percent: number;
    offload_percent: number;
    edge_latency_ms: number;
}

export type AllNodeConfigs =
    | FrontendNodeConfig
    | GatewayNodeConfig
    | LoadBalancerNodeConfig
    | ServiceNodeConfig
    | DatabaseNodeConfig
    | CacheNodeConfig
    | QueueNodeConfig
    | CdnNodeConfig;

export type AnyNodeConfig = AllNodeConfigs & Record<string, unknown>;
