import { Monitor, Shield, Scale, Server, Database, Zap, ListMinus, Globe } from 'lucide-react';

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-[#1a1d2e] border-r border-gray-700 h-full flex flex-col pt-4">
      <div className="px-4 pb-4 border-b border-gray-700">
        <h2 className="text-white font-semibold flex items-center gap-2">
          Component Palette
        </h2>
        <p className="text-gray-400 text-xs mt-1">Drag nodes to canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Network Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3">Network & Entry</h3>
          <div className="space-y-2">
            
            <div 
              className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg cursor-grab hover:bg-blue-500/20 transition-colors"
              onDragStart={(event) => onDragStart(event, 'frontend')}
              draggable
            >
              <div className="p-1.5 bg-blue-500/20 rounded text-blue-400">
                <Monitor size={16} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Frontend Client</div>
                <div className="text-blue-400/70 text-xs">Simulates user traffic</div>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg cursor-grab hover:bg-purple-500/20 transition-colors"
              onDragStart={(event) => onDragStart(event, 'gateway')}
              draggable
            >
              <div className="p-1.5 bg-purple-500/20 rounded text-purple-400">
                <Shield size={16} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">API Gateway</div>
                <div className="text-purple-400/70 text-xs">Auth & Rate Limiting</div>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg cursor-grab hover:bg-teal-500/20 transition-colors"
              onDragStart={(event) => onDragStart(event, 'load_balancer')}
              draggable
            >
              <div className="p-1.5 bg-teal-500/20 rounded text-teal-400">
                <Scale size={16} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Load Balancer</div>
                <div className="text-teal-400/70 text-xs">Distributes traffic</div>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg cursor-grab hover:bg-cyan-500/20 transition-colors"
              onDragStart={(event) => onDragStart(event, 'cdn')}
              draggable
            >
              <div className="p-1.5 bg-cyan-500/20 rounded text-cyan-400">
                <Globe size={16} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">CDN Edge</div>
                <div className="text-cyan-400/70 text-xs">Caches static assets</div>
              </div>
            </div>

          </div>
        </div>

        {/* Compute Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3 mt-2">Compute</h3>
          <div className="space-y-2">
            
            <div 
              className="flex items-center gap-3 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg cursor-grab hover:bg-indigo-500/20 transition-colors"
              onDragStart={(event) => onDragStart(event, 'service')}
              draggable
            >
              <div className="p-1.5 bg-indigo-500/20 rounded text-indigo-400">
                <Server size={16} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Service</div>
                <div className="text-indigo-400/70 text-xs">App logic processing</div>
              </div>
            </div>

          </div>
        </div>

        {/* Data & Storage Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3 mt-2">Data & Storage</h3>
          <div className="space-y-2">
            
            <div 
              className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg cursor-grab hover:bg-orange-500/20 transition-colors"
              onDragStart={(event) => onDragStart(event, 'database')}
              draggable
            >
              <div className="p-1.5 bg-orange-500/20 rounded text-orange-400">
                <Database size={16} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Database</div>
                <div className="text-orange-400/70 text-xs">Persistent Storage</div>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-3 bg-pink-500/10 border border-pink-500/30 rounded-lg cursor-grab hover:bg-pink-500/20 transition-colors"
              onDragStart={(event) => onDragStart(event, 'cache')}
              draggable
            >
              <div className="p-1.5 bg-pink-500/20 rounded text-pink-400">
                <Zap size={16} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Cache</div>
                <div className="text-pink-400/70 text-xs">In-memory K/V store</div>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg cursor-grab hover:bg-yellow-500/20 transition-colors"
              onDragStart={(event) => onDragStart(event, 'queue')}
              draggable
            >
              <div className="p-1.5 bg-yellow-500/20 rounded text-yellow-400">
                <ListMinus size={16} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Message Queue</div>
                <div className="text-yellow-400/70 text-xs">Async processing</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </aside>
  );
}
