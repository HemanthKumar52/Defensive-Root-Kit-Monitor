
import React, { useState } from 'react';
import { Search, Clock, Network, FileText, Cpu, ChevronRight } from 'lucide-react';

export function InvestigationWorkspace() {
  const [timeline, setTimeline] = useState([
      { id: 1, type: 'EXECUTION', category: 'Process Events', entity: 'powershell.exe', action: 'Process Created', details: 'Parent: cmd.exe (pid: 4410)', time: '14:22:15' },
      { id: 2, type: 'NETWORK', category: 'Network Activity', entity: 'powershell.exe', action: 'DNS Query', details: 'Query: evil-domain.com (Type: A)', time: '14:22:16' },
      { id: 3, type: 'NETWORK', category: 'Network Activity', entity: 'powershell.exe', action: 'TCP Connect', details: 'Remote: 185.100.22.1:443', time: '14:22:17' },
      { id: 4, type: 'FILE', category: 'File Operations', entity: 'powershell.exe', action: 'File Write', details: 'C:\\Users\\...\\AppData\\Local\\Temp\\payload.dll', time: '14:22:19' },
      { id: 5, type: 'PERSISTENCE', category: 'Registry Mods', entity: 'reg.exe', action: 'Registry Set', details: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', time: '14:22:25' },
  ]);

  const [filters, setFilters] = useState({
      'Process Events': true,
      'File Operations': true,
      'Network Activity': true,
      'Registry Mods': true,
      'Memory Access': true
  });

  const toggleFilter = (key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredTimeline = timeline.filter(item => filters[item.category] !== false); // Default true if category mapping missing

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="shrink-0">
        <h2 className="text-3xl font-bold text-white tracking-tight">Investigation Workspace</h2>
        <p className="text-gray-400 mt-1">Deep-dive analysis and forensic timeline reconstruction.</p>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          
          {/* Left Panel: Filters & Context */}
          <div className="col-span-3 glass-card p-4 flex flex-col gap-4 overflow-y-auto">
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Target Entity</label>
                  <div className="flex items-center gap-2 mt-2 bg-white/5 p-2 rounded border border-white/10">
                      <Search size={16} className="text-gray-400" />
                      <input type="text" placeholder="PID, Name, or IP..." className="bg-transparent border-none outline-none text-white text-sm w-full" defaultValue="powershell.exe" />
                  </div>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Event Categories</label>
                  <div className="flex flex-col gap-1">
                      {Object.keys(filters).map(key => (
                          <label key={key} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer select-none">
                              <input 
                                  type="checkbox" 
                                  checked={filters[key]} 
                                  onChange={() => toggleFilter(key)}
                                  className="accent-primary" 
                              /> 
                              {key}
                          </label>
                      ))}
                  </div>
              </div>
          </div>

          {/* Center Panel: Timeline */}
          <div className="col-span-6 glass-card p-0 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface/50">
                    <h3 className="font-bold text-white flex items-center gap-2">
                       <Clock size={16} className="text-primary" /> Forensic Timeline
                    </h3>
                    <div className="flex gap-2 text-xs">
                        <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded">Export CSV</button>
                        <button className="px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded">Graph View</button>
                    </div>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                   {filteredTimeline.length === 0 ? (
                       <div className="text-center text-gray-500 mt-10">No events found matching filters.</div>
                   ) : filteredTimeline.map((event, i) => (
                       <div key={i} className="flex gap-4 group">
                           <div className="flex flex-col items-center">
                               <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-surface mt-1.5" />
                               {i !== filteredTimeline.length - 1 && <div className="w-px h-full bg-white/10 my-1" />}
                           </div>
                           <div className="flex-1 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-primary/30 transition-colors">
                               <div className="flex justify-between items-start">
                                   <span className="text-xs font-mono text-gray-500">{event.time}</span>
                                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                       event.type === 'NETWORK' ? 'bg-blue-500/20 text-blue-400' :
                                       event.type === 'EXECUTION' ? 'bg-green-500/20 text-green-400' :
                                       'bg-orange-500/20 text-orange-400'
                                   }`}>{event.type}</span>
                                </div>
                                <div className="text-sm font-bold text-white mt-1">{event.action}</div>
                                <div className="text-xs text-secondary mt-0.5">{event.entity}</div>
                                <div className="text-xs text-gray-400 font-mono mt-2 bg-black/20 p-2 rounded truncate block">
                                    {event.details}
                                </div>
                           </div>
                       </div>
                   ))}
               </div>
          </div>

          {/* Right Panel: Analyzers */}
          <div className="col-span-3 glass-card p-4 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-300 uppercase">Analysis Tools</h3>
              
              <button className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg group transition-all">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded text-blue-400"><Network size={18} /></div>
                      <div className="text-left">
                          <div className="text-sm font-bold text-white">Connections</div>
                          <div className="text-xs text-gray-500">View graph</div>
                      </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-500 group-hover:text-white" />
              </button>

               <button className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg group transition-all">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded text-orange-400"><FileText size={18} /></div>
                      <div className="text-left">
                          <div className="text-sm font-bold text-white">Strings</div>
                          <div className="text-xs text-gray-500">Extract ASCII/UNI</div>
                      </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-500 group-hover:text-white" />
              </button>

               <button className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg group transition-all">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded text-purple-400"><Cpu size={18} /></div>
                      <div className="text-left">
                          <div className="text-sm font-bold text-white">Memory Map</div>
                          <div className="text-xs text-gray-500">View VADs</div>
                      </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-500 group-hover:text-white" />
              </button>

          </div>

      </div>
    </div>
  );
}
