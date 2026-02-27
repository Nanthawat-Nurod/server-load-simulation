import { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useArchitectureStore } from '../../store/architectureStore';
import FrontendNodeComponent from './nodes/FrontendNode';
import GatewayNodeComponent from './nodes/GatewayNode';
import LoadBalancerNodeComponent from './nodes/LoadBalancerNode';
import ServiceNodeComponent from './nodes/ServiceNode';
import DatabaseNodeComponent from './nodes/DatabaseNode';
import CacheNodeComponent from './nodes/CacheNode';
import QueueNodeComponent from './nodes/QueueNode';
import CdnNodeComponent from './nodes/CdnNode';
import type { NodeType } from '../../types/nodes';

const nodeTypes: any = {
  frontend: FrontendNodeComponent,
  gateway: GatewayNodeComponent,
  load_balancer: LoadBalancerNodeComponent,
  service: ServiceNodeComponent,
  database: DatabaseNodeComponent,
  cache: CacheNodeComponent,
  queue: QueueNodeComponent,
  cdn: CdnNodeComponent
};

let id = 0;
const getId = () => `node_${id++}`;

function CanvasArea() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useArchitectureStore();
  
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNodeId = getId();
      
      let baseData: any = { id: newNodeId, type, label: `${type} node` };
      
      // Setup default config based on type
      if (type === 'frontend') {
        baseData = {
          ...baseData,
          concurrent_users: 100,
          requests_per_user_per_second: 1,
          request_pattern: 'steady',
          think_time_ms: 1000,
          request_types: [{ name: 'api', weight_percent: 100, payload_size_kb: 1 }]
        };
      } else if (type === 'gateway') {
        baseData = {
          ...baseData,
          rate_limit_rps: 0,
          rate_limit_strategy: 'reject',
          timeout_ms: 5000,
          retry_attempts: 0,
          retry_delay_ms: 100,
          auth_overhead_ms: 10,
          ssl_overhead_ms: 5,
          routing_rules: [],
          enable_circuit_breaker: false,
          circuit_breaker_threshold_percent: 50,
          circuit_breaker_cooldown_seconds: 10
        };
      } else if (type === 'load_balancer') {
        baseData = {
          ...baseData,
          algorithm: 'round_robin',
          health_check_interval_ms: 5000,
          health_check_timeout_ms: 2000,
          sticky_sessions: false,
          connection_draining_seconds: 30
        };
      } else if (type === 'service') {
        baseData = {
          ...baseData,
          service_name: 'App Service',
          service_type: 'microservice',
          instances: 1,
          cpu_cores: 1,
          memory_gb: 1,
          max_concurrent_requests: 100,
          avg_processing_time_ms: 50,
          processing_time_variance_percent: 20,
          error_rate_percent: 0,
          startup_time_ms: 2000,
          auto_scaling: { enabled: false, min_instances: 1, max_instances: 5, scale_up_cpu_threshold: 80, scale_up_queue_threshold: 100, scale_down_cpu_threshold: 30, cooldown_seconds: 60, scale_up_increment: 1 },
          dependencies: []
        };
      } else if (type === 'database') {
        baseData = {
          ...baseData,
          db_type: 'sql',
          max_connections: 100,
          connection_pool_size: 50,
          read_latency_ms: 5,
          write_latency_ms: 15,
          read_write_ratio: 0.8,
          replication: 'none',
          replica_count: 0,
          max_iops: 5000,
          storage_gb: 100
        };
      } else if (type === 'cache') {
        baseData = {
          ...baseData,
          cache_type: 'in_memory',
          hit_rate_percent: 90,
          capacity_mb: 512,
          eviction_policy: 'lru',
          avg_latency_ms: 1,
          max_connections: 1000
        };
      } else if (type === 'queue') {
        baseData = {
          ...baseData,
          queue_type: 'rabbitmq',
          max_queue_depth: 10000,
          consumer_count: 1,
          consumer_processing_time_ms: 100,
          message_ttl_seconds: 3600,
          delivery_guarantee: 'at_least_once'
        };
      } else if (type === 'cdn') {
        baseData = {
          ...baseData,
          cache_hit_rate_percent: 80,
          offload_percent: 80,
          edge_latency_ms: 10
        };
      }

      const newNode = {
        id: newNodeId,
        type,
        position,
        data: baseData,
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  return (
    <div className="w-full h-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes as any}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(connection) => onConnect({ ...connection, id: `e-${connection.source}-${connection.target}`, animated: true } as any)}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
      >
        <Controls />
        <MiniMap zoomable pannable nodeColor={(n) => {
          if (n.type === 'frontend') return '#3b82f6';
          if (n.type === 'gateway') return '#8b5cf6';
          if (n.type === 'load_balancer') return '#14b8a6';
          if (n.type === 'service') return '#6366f1'; // indigo-500
          if (n.type === 'database') return '#f97316'; // orange-500
          if (n.type === 'cache') return '#ec4899'; // pink-500
          if (n.type === 'queue') return '#eab308'; // yellow-500
          if (n.type === 'cdn') return '#06b6d4'; // cyan-500
          return '#e2e8f0';
        }} />
        <Background color="#1e293b" gap={16} />
      </ReactFlow>
    </div>
  );
}

export default function SimulationCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasArea />
    </ReactFlowProvider>
  );
}
