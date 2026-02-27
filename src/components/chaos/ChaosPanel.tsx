import { useState } from 'react';
import { useArchitectureStore } from '../../store/architectureStore';
import { useMetricsStore } from '../../store/metricsStore';
import { 
  Skull, 
  Zap, 
  WifiOff, 
  Database,
  ServerCrash
} from 'lucide-react';

export default function ChaosPanel() {
  const { nodes, updateNodeConfig } = useArchitectureStore();
  const addEvent = useMetricsStore(state => state.addEvent);
  const [isOpen, setIsOpen] = useState(false);

  const injectSpikeTraffic = () => {
    nodes.forEach(n => {
      if (n.data.type === 'frontend') {
        const current = n.data.concurrent_users as number;
        updateNodeConfig(n.id, { concurrent_users: current * 3 });
        addEvent({
          node_id: n.id,
          node_name: n.data.label as string,
          type: 'warning',
          tick: 0,
          message: `CHAOS: Traffic spiked 3x!`
        });
      }
    });
  };

  const killCache = () => {
    nodes.forEach(n => {
      if (n.data.type === 'cache') {
        updateNodeConfig(n.id, { hit_rate_percent: 0 });
        addEvent({
          node_id: n.id,
          node_name: n.data.label as string,
          type: 'error',
          tick: 0,
          message: `CHAOS: Cache purged and hit rate forced to 0%!`
        });
      }
    });
  };

  const killCdn = () => {
    nodes.forEach(n => {
      if (n.data.type === 'cdn') {
        updateNodeConfig(n.id, { cache_hit_rate_percent: 0, edge_latency_ms: 500 });
        addEvent({
          node_id: n.id,
          node_name: n.data.label as string,
          type: 'error',
          tick: 0,
          message: `CHAOS: Edge CDN bypassed and slowed to 500ms!`
        });
      }
    });
  };

  const networkPartitionDB = () => {
    nodes.forEach(n => {
      if (n.data.type === 'database') {
        const currentR = n.data.read_latency_ms as number;
        const currentW = n.data.write_latency_ms as number;
        updateNodeConfig(n.id, { read_latency_ms: currentR + 2000, write_latency_ms: currentW + 2000 });
        addEvent({
          node_id: n.id,
          node_name: n.data.label as string,
          type: 'error',
          tick: 0,
          message: `CHAOS: Database network partition! Added 2000ms latency.`
        });
      }
    });
  };

  const freezeServices = () => {
    nodes.forEach(n => {
      if (n.data.type === 'service') {
        const current = n.data.avg_processing_time_ms as number;
        updateNodeConfig(n.id, { avg_processing_time_ms: current + 1500 });
        addEvent({
          node_id: n.id,
          node_name: n.data.label as string,
          type: 'warning',
          tick: 0,
          message: `CHAOS: CPU Lockup! Added 1500ms processing delay.`
        });
      }
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute right-4 bottom-20 z-50 bg-rose-600 hover:bg-rose-500 text-white p-3 rounded-full shadow-lg shadow-rose-900/50 transition-all flex items-center justify-center group"
      >
        <Skull size={24} className="group-hover:animate-bounce" />
      </button>
    );
  }

  return (
    <div className="absolute right-4 bottom-20 z-50 w-64 bg-gray-900 border border-rose-900/50 rounded-xl shadow-2xl flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-rose-900/80 to-gray-900 p-3 flex justify-between items-center border-b border-rose-900/30">
        <h3 className="text-white font-bold flex items-center gap-2 text-sm">
          <Skull size={16} className="text-rose-400" />
          Chaos Engineering
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
          Close
        </button>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <ChaosButton 
          icon={<Zap size={14} />} 
          label="Spike Global Traffic (3x)" 
          desc="Triples concurrent users instantly" 
          onClick={injectSpikeTraffic} 
          color="amber"
        />
        
        <ChaosButton 
          icon={<WifiOff size={14} />} 
          label="Kill CDN Edge" 
          desc="Forces 0% hit rate and high latency" 
          onClick={killCdn} 
          color="rose"
        />

        <ChaosButton 
          icon={<ServerCrash size={14} />} 
          label="Purge Caches" 
          desc="Drops all cache hits to zero" 
          onClick={killCache} 
          color="rose"
        />

        <ChaosButton 
          icon={<Skull size={14} />} 
          label="CPU Lockup (Services)" 
          desc="Adds 1.5s delay to all compute" 
          onClick={freezeServices} 
          color="purple"
        />

        <ChaosButton 
          icon={<Database size={14} />} 
          label="DB Network Partition" 
          desc="Adds 2.0s latency to queries" 
          onClick={networkPartitionDB} 
          color="rose"
        />
      </div>
    </div>
  );
}

function ChaosButton({ icon, label, desc, onClick, color }: any) {
  const colorMap: any = {
    amber: 'hover:bg-amber-900/30 border-amber-900/50 text-amber-400',
    rose: 'hover:bg-rose-900/30 border-rose-900/50 text-rose-400',
    purple: 'hover:bg-purple-900/30 border-purple-900/50 text-purple-400',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col text-left p-2 rounded-lg border bg-gray-950/50 transition-all ${colorMap[color]}`}
    >
      <div className="flex items-center gap-2 font-semibold text-xs mb-0.5">
        {icon} {label}
      </div>
      <div className="text-[10px] text-gray-500">{desc}</div>
    </button>
  );
}
