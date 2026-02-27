import React, { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { useArchitectureStore } from '../../store/architectureStore';
import { 
  Play, 
  Pause, 
  Square,
  FastForward,
  Activity,
  ListTree,
  Info
} from 'lucide-react';
import { engine } from '../../engine/SimulationEngine';
import { SCENARIO_PRESETS } from '../../utils/presets';
import { calculateTotalArchitectureCost } from '../../utils/costCalculator';

export default function SimulationControls() {
  const { 
    isRunning, 
    speedMultiplier,
    setSpeed, 
    currentTick 
  } = useSimulationStore();
  const { setNodes, setEdges, nodes } = useArchitectureStore();
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const totalCostMonthly = calculateTotalArchitectureCost(nodes);

  const loadPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    if (!presetId) return;
    
    setSelectedPresetId(presetId);
    const preset = SCENARIO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      engine.stop(); // reset sim
      setNodes(preset.nodes);
      setEdges(preset.edges);
    }
  };

  const selectedPreset = SCENARIO_PRESETS.find(p => p.id === selectedPresetId);

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
        
        <div className="flex items-center gap-2 border-l border-gray-700 pl-6 relative group">
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
          {selectedPreset && (
            <div className="flex items-center text-gray-400 hover:text-blue-400 cursor-help transition-colors ml-2 relative">
              <Info size={16} />
              
              {/* Tooltip */}
              <div className="absolute top-[180%] start-0 mt-2 w-[400px] bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                <div className="flex flex-col gap-2">
                  <h4 className="text-white font-medium text-sm">{selectedPreset.name}</h4>
                  <div className="flex flex-col gap-2 mt-1 border-t border-gray-800 pt-3">
                    <p className="text-[13px] text-blue-300/90 leading-relaxed font-sans">
                      {selectedPreset.descriptionTh}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {selectedPreset.description}
                    </p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="absolute -top-2 left-2 w-4 h-4 bg-gray-900 border-l border-t border-gray-700 rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Playback Controls & Cost */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 rounded-full border border-gray-800" title="Estimated Monthly Cloud Cost based on connected nodes and instances">
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Est. Cost</span>
          <span className="text-sm font-bold text-emerald-400">${totalCostMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-xs text-gray-500 font-normal">/mo</span></span>
        </div>

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
