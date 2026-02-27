import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Monitor } from 'lucide-react';
import type { FrontendNodeConfig } from '../../../types/nodes';
import type { Node } from '@xyflow/react';
import { useMetricsStore } from '../../../store/metricsStore';

export default function FrontendNode({ data, id }: NodeProps<Node<FrontendNodeConfig, 'frontend'>>) {
  const metrics = useMetricsStore(state => state.nodeMetrics[id]);

  return (
    <div className="bg-[#1a1d2e] border-2 border-blue-500 rounded-lg p-3 w-48 shadow-lg text-white">
      <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-2">
        <div className="p-1.5 bg-blue-500/20 rounded-md text-blue-400">
          <Monitor size={18} />
        </div>
        <div className="font-semibold text-sm">Frontend</div>
      </div>
      
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Users:</span>
          <span className="text-gray-200">{data.concurrent_users || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Pattern:</span>
          <span className="text-gray-200 capitalize">{data.request_pattern || 'steady'}</span>
        </div>
        
        {/* Node Metrics Badge */}
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center text-blue-400 font-mono text-sm">
            <span>RPS Out:</span>
            <span>{metrics?.rps || 0}</span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  );
}
