import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Scale } from 'lucide-react';
import type { LoadBalancerNodeConfig } from '../../../types/nodes';
import type { Node } from '@xyflow/react';
import { useMetricsStore } from '../../../store/metricsStore';

export default function LoadBalancerNode({ data, id }: NodeProps<Node<LoadBalancerNodeConfig, 'load_balancer'>>) {
  const metrics = useMetricsStore(state => state.nodeMetrics[id]);

  return (
    <div className="bg-[#1a1d2e] border-2 border-teal-500 rounded-lg p-3 w-48 shadow-lg text-white">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-teal-500" />
      
      <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-2">
        <div className="p-1.5 bg-teal-500/20 rounded-md text-teal-400">
          <Scale size={18} />
        </div>
        <div className="font-semibold text-sm">Load Balancer</div>
      </div>
      
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Algo:</span>
          <span className="text-gray-200 capitalize">{data.algorithm?.replace('_', ' ')}</span>
        </div>
        
        {/* Node Metrics Badges */}
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center text-teal-400 font-mono text-sm">
            <span>RPS:</span>
            <span>{metrics?.rps || 0}</span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-teal-500" />
    </div>
  );
}
