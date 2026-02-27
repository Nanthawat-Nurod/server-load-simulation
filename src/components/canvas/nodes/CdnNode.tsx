import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { CdnNodeConfig } from '../../../types/nodes';
import { Globe } from 'lucide-react';
import { useMetricsStore } from '../../../store/metricsStore';

export default function CdnNode({ data, id }: NodeProps<Node<CdnNodeConfig, 'cdn'>>) {
  const metrics = useMetricsStore(state => state.nodeMetrics[id]);
  return (
    <div className="px-4 py-2 rounded-lg shadow-md border-2 border-cyan-500 bg-cyan-900/90 text-white flex flex-col items-center justify-center min-w-[150px]">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-cyan-400 border-none" />
      
      <div className="flex items-center gap-2 mb-2 w-full border-b border-cyan-700 pb-2">
        <Globe size={18} className="text-cyan-300" />
        <h3 className="text-sm font-semibold truncate">{data.label || 'CDN edge'}</h3>
      </div>
      
      <div className="text-xs w-full space-y-1">
        <div className="flex justify-between">
          <span className="text-cyan-300">Hit Rate:</span>
          <span>{data.cache_hit_rate_percent || 80}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cyan-300">Offloaded:</span>
          <span>{metrics?.rps || 0} req/s</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-cyan-400 border-none" />
    </div>
  );
}
