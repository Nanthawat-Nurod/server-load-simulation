import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { QueueNodeConfig } from '../../../types/nodes';
import { ListMinus } from 'lucide-react';
import { useMetricsStore } from '../../../store/metricsStore';

export default function QueueNode({ data, id }: NodeProps<Node<QueueNodeConfig, 'queue'>>) {
  const metrics = useMetricsStore(state => state.nodeMetrics[id]);
  return (
    <div className="px-4 py-2 rounded-lg shadow-md border-2 border-yellow-500 bg-yellow-900/90 text-white flex flex-col items-center justify-center min-w-[150px]">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-yellow-400 border-none" />
      
      <div className="flex items-center gap-2 mb-2 w-full border-b border-yellow-700 pb-2">
        <ListMinus size={18} className="text-yellow-300" />
        <h3 className="text-sm font-semibold truncate">{data.label || 'Message Queue'}</h3>
      </div>
      
      <div className="text-xs w-full space-y-1">
        <div className="flex justify-between">
          <span className="text-yellow-300">Depth:</span>
          <span>{metrics?.queue_depth || 0} / {data.max_queue_depth || 10000}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-yellow-300">Consumers:</span>
          <span>{data.consumer_count || 1}</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-yellow-400 border-none" />
    </div>
  );
}
