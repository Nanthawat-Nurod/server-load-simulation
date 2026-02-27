import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { ServiceNodeConfig } from '../../../types/nodes';
import { Server } from 'lucide-react';
import { useMetricsStore } from '../../../store/metricsStore';

export default function ServiceNode({ data, id }: NodeProps<Node<ServiceNodeConfig, 'service'>>) {
  const metrics = useMetricsStore(state => state.nodeMetrics[id]);
  return (
    <div className="px-4 py-2 rounded-lg shadow-md border-2 border-indigo-500 bg-indigo-900/90 text-white flex flex-col items-center justify-center min-w-[150px]">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-indigo-400 border-none" />
      
      <div className="flex items-center gap-2 mb-2 w-full border-b border-indigo-700 pb-2">
        <Server size={18} className="text-indigo-300" />
        <h3 className="text-sm font-semibold truncate">{data.label || 'Service'}</h3>
      </div>
      
      <div className="text-xs w-full space-y-1">
        <div className="flex justify-between">
          <span className="text-indigo-300">Instances:</span>
          <span>{data.instances || 1}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-indigo-300">CPU:</span>
          <span>{Math.min(100, (((metrics?.active_requests || 0) / Math.max(1, (data.instances || 1) * (data.max_concurrent_requests || 100))) * 100)).toFixed(0)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-indigo-300">Queue:</span>
          <span>{metrics?.queue_depth || 0}</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-indigo-400 border-none" />
    </div>
  );
}
