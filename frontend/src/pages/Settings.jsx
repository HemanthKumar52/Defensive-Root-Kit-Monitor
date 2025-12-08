
import React from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Sliders } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Configuration</h2>
        <p className="text-gray-400 mt-1">Adjust detection sensitivity, manage whitelists, and configure system monitoring levels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Module Toggles */}
          <div className="glass-card p-6 space-y-6">
              <h3 className="text-white font-bold flex items-center gap-2 border-b border-white/10 pb-4">
                  <Sliders size={18} className="text-primary" /> Detection Modules
              </h3>
              
              {[
                  { name: 'Kernel Integrity Monitor', desc: 'Scan SSDT, IDT, and Driver Objects', active: true },
                  { name: 'Multi-Method Process Enum', desc: 'Cross-reference WinAPI vs NtQuery vs Kernel', active: true },
                  { name: 'Memory Scanner', desc: 'Deep scan specific processes for RWX pages', active: true },
                  { name: 'Network Filter Driver', desc: 'Monitor raw packet flow and hidden sockets', active: false },
                  { name: 'Behavioral Analysis (ML)', desc: 'Real-time anomaly scoring', active: true },
              ].map((mod, i) => (
                  <div key={i} className="flex items-start justify-between">
                      <div>
                          <div className="text-white font-medium">{mod.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{mod.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={mod.active} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all   peer-checked:bg-primary"></div>
                      </label>
                  </div>
              ))}
          </div>

          {/* Sensitivity & Whitelist */}
          <div className="space-y-6">
              <div className="glass-card p-6 space-y-6">
                  <h3 className="text-white font-bold flex items-center gap-2 border-b border-white/10 pb-4">
                      <Sliders size={18} className="text-secondary" /> Sensitivity Thresholds
                  </h3>
                  
                  <div className="space-y-4">
                      <div>
                          <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-300">Anomaly Score Trigger</span>
                              <span className="text-primary font-bold">75%</span>
                          </div>
                          <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary" />
                      </div>
                       <div>
                          <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-300">Heuristic Aggressiveness</span>
                              <span className="text-secondary font-bold">High</span>
                          </div>
                          <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-secondary" />
                      </div>
                  </div>
              </div>

               <div className="glass-card p-6">
                  <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                      Whitelist Management
                  </h3>
                  <div className="space-y-2">
                      <div className="bg-white/5 p-3 rounded flex justify-between items-center text-sm">
                          <span className="text-gray-300 font-mono">C:\Program Files\TrustedApp\app.exe</span>
                          <button className="text-red-400 hover:text-red-300">Remove</button>
                      </div>
                      <button className="w-full py-2 bg-white/5 border border-white/10 rounded border-dashed text-gray-400 text-sm hover:bg-white/10 transition-colors">
                          + Add Trusted Path
                      </button>
                  </div>
              </div>
          </div>
      </div>

       <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
           <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors">
               Discard Changes
           </button>
           <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg font-bold flex items-center gap-2 transition-colors">
               <Save size={18} /> Save Configuration
           </button>
       </div>
    </div>
  );
}
