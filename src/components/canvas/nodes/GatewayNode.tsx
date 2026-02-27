import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Shield } from 'lucide-react';
import type { GatewayNodeConfig } from '../../../types/nodes';
import type { Node } from '@xyflow/react';
import { useMetricsStore } from '../../../store/metricsStore';

export default function GatewayNode({ data, id }: NodeProps<Node<GatewayNodeConfig, 'gateway'>>) {
  const metrics = useMetricsStore(state => state.nodeMetrics[id]);

  return (
    <div className="bg-[#1a1d2e] border-2 border-purple-500 rounded-lg p-3 w-48 shadow-lg text-white">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-500" />
      
      <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-2">
        <div className="p-1.5 bg-purple-500/20 rounded-md text-purple-400">
          <Shield size={18} />
        </div>
        <div className="font-semibold text-sm">API Gateway</div>
      </div>
      
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Rate Limit:</span>
          <span className="text-gray-200">{data.rate_limit_rps || '∞'} rps</span>
        </div>
        
        {/* Node Metrics Badges */}
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center text-purple-400 font-mono text-sm">
            <span>RPS In:</span>
            <span>{metrics?.rps || 0}</span>
          </div>
          <div className="flex justify-between items-center text-green-400 font-mono text-xs">
            <span>Latency:</span>
            <span>{(metrics?.latency_avg_ms || 0).toFixed(0)}ms</span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500" />
    </div>
  );
}
