import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { DatabaseNodeConfig } from '../../../types/nodes';
import { Database } from 'lucide-react';
import { useMetricsStore } from '../../../store/metricsStore';

export default function DatabaseNode({ data, id }: NodeProps<Node<DatabaseNodeConfig, 'database'>>) {
  const metrics = useMetricsStore(state => state.nodeMetrics[id]);
  return (
    <div className="px-4 py-2 rounded-lg shadow-md border-2 border-orange-500 bg-orange-900/90 text-white flex flex-col items-center justify-center min-w-[150px]">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-orange-400 border-none" />
      
      <div className="flex items-center gap-2 mb-2 w-full border-b border-orange-700 pb-2">
        <Database size={18} className="text-orange-300" />
        <h3 className="text-sm font-semibold truncate">{data.label || 'Database'}</h3>
      </div>
      
      <div className="text-xs w-full space-y-1">
        <div className="flex justify-between">
          <span className="text-orange-300">Type:</span>
          <span className="capitalize">{data.db_type || 'sql'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-orange-300">Connections:</span>
          <span>0 / {data.connection_pool_size || 100}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-orange-300">IOPS:</span>
          <span>{metrics?.rps || 0}</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-orange-400 border-none" />
    </div>
  );
}
