import { useSimulationStore } from '../../store/simulationStore';
import { useMetricsStore } from '../../store/metricsStore';
import { Activity, ServerCrash, AlertTriangle } from 'lucide-react';

export default function MetricsDashboard() {
  const { globalHealthScore, isRunning } = useSimulationStore();
  const { systemMetrics } = useMetricsStore();
  
  return (
    <div className="h-48 border-t border-gray-700 bg-[#151822] flex flex-col z-20 shrink-0">
      <div className="px-4 py-2 border-b border-gray-800 flex justify-between items-center bg-[#11131a]">
        <h3 className="text-white text-xs font-semibold flex items-center gap-2 tracking-wider">
          <Activity size={14} className="text-green-400" />
          SYSTEM METRICS DASHBOARD
        </h3>
        <div className="text-xs text-gray-500 flex gap-4">
          <span>Global Health: <span className={`font-bold ${globalHealthScore > 80 ? 'text-green-400' : globalHealthScore > 40 ? 'text-yellow-400' : 'text-red-500'}`}>{globalHealthScore.toFixed(0)}%</span></span>
        </div>
      </div>
      
      <div className="flex-1 p-4 grid grid-cols-4 gap-4 overflow-y-auto">
        
        {/* Metric Card 1 */}
        <div className="bg-[#1e2230] rounded-lg p-3 border border-gray-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Traffic</span>
            <Activity size={14} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{systemMetrics.total_rps.toFixed(0)}</span>
            <span className="text-xs text-gray-500 mb-1">req/s</span>
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400">Incoming requests per second.</span>
            <span className="text-[10px] text-gray-500 font-sans">ปริมาณคำขอเข้าสู่ระบบต่อวินาที</span>
          </div>
          <div className="mt-2 h-6 w-full bg-gray-900 rounded overflow-hidden flex items-end">
            <div 
               className="w-full bg-blue-500/50 transition-all duration-300"
               style={{ height: `${Math.min(100, (systemMetrics.total_rps / 1000) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-[#1e2230] rounded-lg p-3 border border-gray-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Latency (p95)</span>
            <Activity size={14} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{systemMetrics.p95_latency_ms.toFixed(0)}</span>
            <span className="text-xs text-gray-500 mb-1">ms</span>
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400">Response time for 95% of traffic.</span>
            <span className="text-[10px] text-gray-500 font-sans">เวลาตอบสนองโดยเฉลี่ยของระบบ</span>
          </div>
          <div className="mt-2 h-6 w-full bg-gray-900 rounded overflow-hidden flex items-end justify-between px-1 gap-1">
             <div 
               className={`w-full transition-all duration-300 ${systemMetrics.p95_latency_ms > 1000 ? 'bg-red-500/50' : 'bg-purple-500/50'}`}
               style={{ height: `${Math.min(100, (systemMetrics.p95_latency_ms / 2000) * 100)}%` }}
             ></div>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-[#1e2230] rounded-lg p-3 border border-gray-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Error Rate</span>
            <AlertTriangle size={14} className="text-yellow-500/70" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{(100 - systemMetrics.success_rate_percent).toFixed(2)}</span>
            <span className="text-xs text-gray-500 mb-1">%</span>
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400">Percentage of failed requests.</span>
            <span className="text-[10px] text-gray-500 font-sans">อัตราส่วนคำขอที่เกิดข้อผิดพลาด</span>
          </div>
          <div className="mt-2 h-6 w-full bg-gray-900 rounded overflow-hidden flex items-end">
             <div 
               className="w-full bg-red-500/50 transition-all duration-300"
               style={{ height: `${100 - systemMetrics.success_rate_percent}%` }}
             ></div>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-[#1e2230] rounded-lg p-3 border border-gray-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Concurrency</span>
            <ServerCrash size={14} className="text-orange-500/70" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{systemMetrics.total_active_requests}</span>
            <span className="text-xs text-gray-500 mb-1">requests</span>
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400">Currently processing & queued queries.</span>
            <span className="text-[10px] text-gray-500 font-sans">จำนวนคำขอที่กำลังประมวลผล หรือค้างในคิว</span>
          </div>
          <div className="mt-2 h-6 w-full bg-gray-900 rounded overflow-hidden flex items-end">
             <div 
               className="w-full bg-orange-500/50 transition-all duration-300"
               style={{ height: `${Math.min(100, (systemMetrics.total_active_requests / 5000) * 100)}%` }}
             ></div>
          </div>
        </div>

      </div>
      
      {!isRunning && (
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <span className="text-gray-400 flex items-center gap-2 font-medium tracking-wide">
            <Activity size={18} /> Simulation is stopped. Press Play to see live metrics.
          </span>
        </div>
      )}
    </div>
  );
}
