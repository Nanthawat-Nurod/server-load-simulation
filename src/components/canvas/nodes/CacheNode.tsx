import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { CacheNodeConfig } from '../../../types/nodes';
import { Zap } from 'lucide-react';
import { useMetricsStore } from '../../../store/metricsStore';

export default function CacheNode({ data, id }: NodeProps<Node<CacheNodeConfig, 'cache'>>) {
  const metrics = useMetricsStore(state => state.nodeMetrics[id]);
  return (
    <div className="px-4 py-2 rounded-lg shadow-md border-2 border-pink-500 bg-pink-900/90 text-white flex flex-col items-center justify-center min-w-[150px]">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-pink-400 border-none" />
      
      <div className="flex items-center gap-2 mb-2 w-full border-b border-pink-700 pb-2">
        <Zap size={18} className="text-pink-300" />
        <h3 className="text-sm font-semibold truncate">{data.label || 'Redis Cache'}</h3>
      </div>
      
      <div className="text-xs w-full space-y-1">
        <div className="flex justify-between">
          <span className="text-pink-300">Hit Rate:</span>
          <span>{data.hit_rate_percent || 90}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-pink-300">Hits/sec:</span>
          <span>{metrics?.rps || 0}</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-pink-400 border-none" />
    </div>
  );
}
