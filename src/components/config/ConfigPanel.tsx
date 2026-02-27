
import { useArchitectureStore } from '../../store/architectureStore';
import type { 
  AllNodeConfigs, 
  FrontendNodeConfig, 
  GatewayNodeConfig, 
  LoadBalancerNodeConfig,
  ServiceNodeConfig,
  DatabaseNodeConfig,
  CacheNodeConfig,
  QueueNodeConfig,
  CdnNodeConfig
} from '../../types/nodes';
import { X } from 'lucide-react';
import HistoricalChart from './HistoricalChart';

export default function ConfigPanel() {
  const { nodes, updateNodeConfig, setNodes } = useArchitectureStore();

  // Find the selected node
  const selectedNode = nodes.find(n => n.selected);

  if (!selectedNode) {
    return null;
  }

  const data = selectedNode.data as AllNodeConfigs;

  const handleClose = () => {
    setNodes(nodes.map((n) => ({ ...n, selected: false })));
  };

  const updateField = (field: string, value: any) => {
    updateNodeConfig(selectedNode.id, { [field]: value });
  };

  return (
    <aside className="w-80 bg-[#1a1d2e] border-l border-gray-700 h-full flex flex-col pt-4 shadow-xl z-10 absolute right-0 top-14 bottom-0">
      <div className="px-4 pb-4 border-b border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-white font-semibold flex items-center gap-2 capitalize">
            {data.type.replace('_', ' ')} Settings
          </h2>
          <p className="text-gray-400 text-xs mt-1">ID: {selectedNode.id}</p>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
        
        <HistoricalChart nodeId={selectedNode.id} />

        {data.type === 'frontend' && (
          <FrontendConfig data={data as FrontendNodeConfig} updateField={updateField} />
        )}
        
        {data.type === 'gateway' && (
          <GatewayConfig data={data as GatewayNodeConfig} updateField={updateField} />
        )}
        
        {data.type === 'load_balancer' && (
          <LoadBalancerConfig data={data as LoadBalancerNodeConfig} updateField={updateField} />
        )}
        
        {data.type === 'service' && (
          <ServiceConfig data={data as ServiceNodeConfig} updateField={updateField} />
        )}

        {data.type === 'database' && (
          <DatabaseConfig data={data as DatabaseNodeConfig} updateField={updateField} />
        )}

        {data.type === 'cache' && (
          <CacheConfig data={data as CacheNodeConfig} updateField={updateField} />
        )}

        {data.type === 'queue' && (
          <QueueConfig data={data as QueueNodeConfig} updateField={updateField} />
        )}

        {data.type === 'cdn' && (
          <CdnConfig data={data as CdnNodeConfig} updateField={updateField} />
        )}
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────
// Sub-components for specific node configurations
// ─────────────────────────────────────────────────────────────────

function FrontendConfig({ data, updateField }: { data: FrontendNodeConfig, updateField: (f: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Concurrent Users</label>
        <div className="flex gap-2">
          <input 
            type="range" min="1" max="10000" 
            value={data.concurrent_users} 
            onChange={e => updateField('concurrent_users', Number(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <input 
            type="number" 
            value={data.concurrent_users} 
            onChange={e => updateField('concurrent_users', Number(e.target.value))}
            className="w-20 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-400 mb-1 text-xs">Requests Per User / Sec</label>
        <input 
          type="number" step="0.1" 
          value={data.requests_per_user_per_second} 
          onChange={e => updateField('requests_per_user_per_second', Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-1 text-xs">Request Pattern</label>
        <select 
          value={data.request_pattern} 
          onChange={e => updateField('request_pattern', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-blue-500 capitalize"
        >
          <option value="steady">Steady</option>
          <option value="burst">Burst</option>
          <option value="ramp_up">Ramp Up</option>
          <option value="wave">Wave</option>
          <option value="spike">Spike</option>
        </select>
      </div>

      {['burst', 'spike'].includes(data.request_pattern) && (
        <div>
          <label className="block text-gray-400 mb-1 text-xs">Burst Multiplier</label>
          <input 
            type="number" min="1" max="100" 
            value={data.burst_multiplier || 1} 
            onChange={e => updateField('burst_multiplier', Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
}

function GatewayConfig({ data, updateField }: { data: GatewayNodeConfig, updateField: (f: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Rate Limit RPS (0 = unlim)</label>
        <input 
          type="number" 
          value={data.rate_limit_rps} 
          onChange={e => updateField('rate_limit_rps', Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-1 text-xs">Rate Limit Strategy</label>
        <select 
          value={data.rate_limit_strategy} 
          onChange={e => updateField('rate_limit_strategy', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500 capitalize"
        >
          <option value="reject">Reject (503)</option>
          <option value="queue">Queue</option>
          <option value="throttle">Throttle</option>
        </select>
      </div>

      <div className="pt-2 border-t border-gray-800">
        <label className="block text-gray-400 mb-1 text-xs">Timeout (ms)</label>
        <input 
          type="number" 
          value={data.timeout_ms} 
          onChange={e => updateField('timeout_ms', Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500"
        />
      </div>

      <div className="pt-2 border-t border-gray-800">
        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
          <input 
            type="checkbox" 
            checked={data.enable_circuit_breaker}
            onChange={e => updateField('enable_circuit_breaker', e.target.checked)}
            className="accent-purple-500 w-4 h-4 cursor-pointer"
          />
          Enable Circuit Breaker
        </label>
        
        {data.enable_circuit_breaker && (
          <div className="mt-3 pl-6 space-y-3">
             <div>
              <label className="block text-gray-500 mb-1 text-[10px] uppercase">Error Threshold (%)</label>
              <input 
                type="number" min="1" max="100"
                value={data.circuit_breaker_threshold_percent} 
                onChange={e => updateField('circuit_breaker_threshold_percent', Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1 text-[10px] uppercase">Cooldown (sec)</label>
              <input 
                type="number" 
                value={data.circuit_breaker_cooldown_seconds} 
                onChange={e => updateField('circuit_breaker_cooldown_seconds', Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadBalancerConfig({ data, updateField }: { data: LoadBalancerNodeConfig, updateField: (f: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Algorithm</label>
        <select 
          value={data.algorithm} 
          onChange={e => updateField('algorithm', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-teal-500 capitalize"
        >
          <option value="round_robin">Round Robin</option>
          <option value="least_connections">Least Connections</option>
          <option value="weighted">Weighted</option>
          <option value="ip_hash">IP Hash</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer mt-4">
          <input 
            type="checkbox" 
            checked={data.sticky_sessions}
            onChange={e => updateField('sticky_sessions', e.target.checked)}
            className="accent-teal-500 w-4 h-4 cursor-pointer"
          />
          Sticky Sessions
        </label>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// NEW COMPUTING & STORAGE NODE CONFIGURATIONS
// ─────────────────────────────────────────────────────────────────

function ServiceConfig({ data, updateField }: { data: ServiceNodeConfig, updateField: (f: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Service Type</label>
        <select 
          value={data.service_type} 
          onChange={e => updateField('service_type', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-indigo-500 capitalize"
        >
          <option value="microservice">Microservice</option>
          <option value="monolith">Monolith</option>
          <option value="serverless_function">Serverless</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-400 mb-1 text-xs">Instances</label>
        <input 
          type="number" min="1" max="100"
          value={data.instances} 
          onChange={e => updateField('instances', Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-gray-400 mb-1 text-xs">CPU Cores</label>
          <input 
            type="number" step="0.5"
            value={data.cpu_cores} 
            onChange={e => updateField('cpu_cores', Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-400 mb-1 text-xs">Memory (GB)</label>
          <input 
            type="number" step="0.5"
            value={data.memory_gb} 
            onChange={e => updateField('memory_gb', Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-400 mb-1 text-xs">Avg Processing Time (ms)</label>
        <input 
          type="number" 
          value={data.avg_processing_time_ms} 
          onChange={e => updateField('avg_processing_time_ms', Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-indigo-500"
        />
      </div>

      <div className="pt-4 border-t border-gray-800">
        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer font-medium mb-3">
          <input 
            type="checkbox" 
            checked={data.auto_scaling?.enabled || false}
            onChange={e => updateField('auto_scaling', { ...data.auto_scaling, enabled: e.target.checked })}
            className="accent-indigo-500 w-4 h-4 cursor-pointer"
          />
          Enable Auto-Scaling
        </label>

        {data.auto_scaling?.enabled && (
          <div className="space-y-3 pl-6 border-l-2 border-indigo-500/30">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-500 mb-1 text-[10px] uppercase">Min Instances</label>
                <input 
                  type="number" min="1" max="100"
                  value={data.auto_scaling.min_instances} 
                  onChange={e => updateField('auto_scaling', { ...data.auto_scaling, min_instances: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-500 mb-1 text-[10px] uppercase">Max Instances</label>
                <input 
                  type="number" min="1" max="100"
                  value={data.auto_scaling.max_instances} 
                  onChange={e => updateField('auto_scaling', { ...data.auto_scaling, max_instances: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500 mb-1 text-[10px] uppercase">Scale Up CPUs &gt; (%)</label>
              <input 
                type="number" min="1" max="100"
                value={data.auto_scaling.scale_up_cpu_threshold} 
                onChange={e => updateField('auto_scaling', { ...data.auto_scaling, scale_up_cpu_threshold: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DatabaseConfig({ data, updateField }: { data: DatabaseNodeConfig, updateField: (f: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Type</label>
        <select 
          value={data.db_type} 
          onChange={e => updateField('db_type', e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-orange-500 capitalize"
        >
          <option value="sql">SQL (Relational)</option>
          <option value="nosql">NoSQL</option>
          <option value="in_memory">In-Memory (KV)</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-400 mb-1 text-xs">Connection Pool Size</label>
        <input 
          type="number" 
          value={data.connection_pool_size} 
          onChange={e => updateField('connection_pool_size', Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-orange-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-gray-400 mb-1 text-xs">Read Latency</label>
          <div className="relative">
            <input 
              type="number" 
              value={data.read_latency_ms} 
              onChange={e => updateField('read_latency_ms', Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-700 rounded pl-2 pr-6 py-1.5 text-white text-xs outline-none flex-1 focus:border-orange-500"
            />
            <span className="absolute right-2 top-1.5 text-xs text-gray-500">ms</span>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-gray-400 mb-1 text-xs">Write Latency</label>
          <div className="relative">
            <input 
              type="number" 
              value={data.write_latency_ms} 
              onChange={e => updateField('write_latency_ms', Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-700 rounded pl-2 pr-6 py-1.5 text-white text-xs outline-none flex-1 focus:border-orange-500"
            />
            <span className="absolute right-2 top-1.5 text-xs text-gray-500">ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CacheConfig({ data, updateField }: { data: CacheNodeConfig, updateField: (f: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Hit Rate (%)</label>
        <input 
          type="range" min="0" max="100" 
          value={data.hit_rate_percent} 
          onChange={e => updateField('hit_rate_percent', Number(e.target.value))}
          className="w-full accent-pink-500"
        />
        <div className="text-right text-xs text-pink-400 mt-1">{data.hit_rate_percent}%</div>
      </div>
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Capacity (MB)</label>
        <input 
          type="number" 
          value={data.capacity_mb} 
          onChange={e => updateField('capacity_mb', Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-pink-500"
        />
      </div>
    </div>
  );
}

function QueueConfig({ data, updateField }: { data: QueueNodeConfig, updateField: (f: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Max Queue Depth</label>
        <input 
          type="number" 
          value={data.max_queue_depth} 
          onChange={e => updateField('max_queue_depth', Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-yellow-500"
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Consumers</label>
        <input 
          type="number" min="1"
          value={data.consumer_count} 
          onChange={e => updateField('consumer_count', Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-yellow-500"
        />
      </div>
    </div>
  );
}

function CdnConfig({ data, updateField }: { data: CdnNodeConfig, updateField: (f: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-400 mb-1 text-xs">Cache Hit Rate (%)</label>
        <input 
          type="range" min="0" max="100" 
          value={data.cache_hit_rate_percent} 
          onChange={e => updateField('cache_hit_rate_percent', Number(e.target.value))}
          className="w-full accent-cyan-500"
        />
        <div className="text-right text-xs text-cyan-400 mt-1">{data.cache_hit_rate_percent}%</div>
      </div>
    </div>
  );
}
