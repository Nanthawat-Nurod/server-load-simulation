import { useMetricsStore } from '../../store/metricsStore';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

export default function HistoricalChart({ nodeId }: { nodeId: string }) {
  const nodeMetrics = useMetricsStore(state => state.nodeMetrics[nodeId]);
  const history = nodeMetrics?.history || [];

  if (history.length === 0) {
    return (
      <div className="h-32 w-full mb-6 bg-gray-950 rounded-lg flex items-center justify-center border border-gray-800">
        <span className="text-xs text-gray-600">No historical data. Play simulation.</span>
      </div>
    );
  }

  return (
    <div className="h-40 w-full mb-6 bg-gray-950 rounded-lg p-3 border border-gray-800 flex flex-col">
      <h3 className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Live Performance (60 Ticks)</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="tick" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f111a', border: '1px solid #1e293b', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
              itemStyle={{ padding: 0 }}
              labelStyle={{ display: 'none' }}
              cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line type="monotone" dataKey="rps" stroke="#3b82f6" strokeWidth={1.5} dot={false} isAnimationActive={false} name="Incoming RPS (req/s)" />
            <Line type="monotone" dataKey="latency" stroke="#a855f7" strokeWidth={1.5} dot={false} isAnimationActive={false} name="Latency (ms)" />
            <Line type="monotone" dataKey="active_requests" stroke="#f97316" strokeWidth={1.5} dot={false} isAnimationActive={false} name="Active/Queue" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
