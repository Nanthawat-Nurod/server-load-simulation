import SimulationCanvas from './components/canvas/SimulationCanvas';
import Sidebar from './components/sidebar/Sidebar';
import ConfigPanel from './components/config/ConfigPanel';
import SimulationControls from './components/controls/SimulationControls';
import MetricsDashboard from './components/dashboard/MetricsDashboard';
import ChaosPanel from './components/chaos/ChaosPanel';

function App() {
  return (
    <div className="w-screen h-screen flex flex-col bg-[#0f1117] text-white overflow-hidden">
      <SimulationControls />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 relative border-r border-gray-700 flex flex-col">
          <div className="flex-1 relative">
            <SimulationCanvas />
          </div>
          <MetricsDashboard />
        </main>
        <ConfigPanel />
        <ChaosPanel />
      </div>
    </div>
  );
}

export default App;
