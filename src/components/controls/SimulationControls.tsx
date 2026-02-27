import { useSimulationStore } from '../../store/simulationStore';
import { useArchitectureStore } from '../../store/architectureStore';
import { 
  Play, 
  Pause, 
  Square,
  FastForward,
  Activity,
  ListTree
} from 'lucide-react';
import { engine } from '../../engine/SimulationEngine';
import { SCENARIO_PRESETS } from '../../utils/presets';

export default function SimulationControls() {
  const { 
    isRunning, 
    speedMultiplier,
    setSpeed, 
    currentTick 
  } = useSimulationStore();
  const { setNodes, setEdges } = useArchitectureStore();

  const loadPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    if (!presetId) return;
    
    const preset = SCENARIO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      engine.stop(); // reset sim
      setNodes(preset.nodes);
      setEdges(preset.edges);
    }
  };

  const handlePlayPause = () => {
    if (isRunning) {
      engine.pause();
    } else {
      engine.start();
    }
  };

  const handleStop = () => {
    engine.stop();
  };

  const formatTime = (ticks: number) => {
    // Assuming 1 tick = 100ms for display purposes
    const totalSeconds = Math.floor(ticks / 10);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="h-14 border-b border-gray-800 bg-gray-900/95 flex items-center justify-between px-6 select-none shrink-0">
      
      {/* Left: Brand / Title & Presets */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-gray-200 tracking-tight">ServerSim</span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-gray-700 pl-6">
          <ListTree size={16} className="text-gray-400" />
          <select 
            onChange={loadPreset}
            defaultValue=""
            className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer hover:text-white"
          >
            <option value="" disabled className="text-gray-500 bg-gray-900">Load Preset...</option>
            {SCENARIO_PRESETS.map(p => (
              <option key={p.id} value={p.id} className="bg-gray-900 text-gray-200">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Playback Controls */}
      <div className="flex items-center gap-4 bg-gray-950/50 px-4 py-1.5 rounded-full border border-gray-800">
        <button 
          onClick={handlePlayPause}
          className={`p-1.5 rounded-md transition-colors ${
            isRunning 
              ? 'text-amber-500 hover:bg-amber-500/10' 
              : 'text-emerald-500 hover:bg-emerald-500/10'
          }`}
          title={isRunning ? "Pause Simulation" : "Start Simulation"}
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
        
        <button 
          onClick={handleStop}
          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
          title="Stop & Reset"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>

        <div className="w-px h-5 bg-gray-800 mx-2" />

        <div className="flex items-center gap-1">
          <FastForward className="w-4 h-4 text-gray-500" />
          <select 
            value={speedMultiplier}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-transparent text-sm font-medium text-gray-300 outline-none cursor-pointer hover:text-white"
          >
            <option value={1} className="bg-gray-900">1x Speed</option>
            <option value={2} className="bg-gray-900">2x Speed</option>
            <option value={5} className="bg-gray-900">5x Speed</option>
            <option value={10} className="bg-gray-900">10x Speed</option>
          </select>
        </div>
      </div>

      {/* Right: Clock & Status */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sim Clock</span>
          <span className="text-sm font-mono text-gray-300">{formatTime(currentTick)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full relative">
            <div className={`absolute inset-0 rounded-full opacity-75 ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-gray-600'}`} />
            <div className={`relative w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500' : 'bg-gray-500'}`} />
          </div>
          <span className="text-xs font-medium text-gray-400 w-16">
            {isRunning ? 'RUNNING' : 'STOPPED'}
          </span>
        </div>
      </div>
      
    </div>
  );
}
