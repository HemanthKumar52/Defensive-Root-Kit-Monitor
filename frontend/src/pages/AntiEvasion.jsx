
import React from 'react';
import { EyeOff, Box, Code, AlertTriangle, Shield } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export function AntiEvasion() {
  const evasionTechniques = [
      { technique: 'CPUID Hypervisor Check', method: 'Assembly check (CPUID leaf 1)', detected_in: 'pid: 3320 (loader.exe)', time: '14:22:01' },
      { technique: 'Sleep Patching', method: 'Modified NtDelayExecution', detected_in: 'RAM (0x400000)', time: '14:20:55' },
      { technique: 'Debugger Check', method: 'IsDebuggerPresent API', detected_in: 'pid: 1102 (chrome.exe)', time: '13:50:11' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Anti-Evasion Monitor</h2>
        <p className="text-gray-400 mt-1">Detection of malware attempts to detect VMs, sandboxes, and debuggers.</p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Evasion Attempts" value="3" icon={EyeOff} color="danger" />
          <StatsCard title="Packed Binaries" value="12" icon={Box} color="warning" />
          <StatsCard title="Deobfuscation" value="ACTIVE" icon={Code} color="primary" />
      </div>

      <div className="glass-card">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                   <AlertTriangle size={18} className="text-secondary" /> Detected Environment Checks
              </h3>
          </div>
          <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                  <tr>
                      <th className="p-4">Technique</th>
                      <th className="p-4">Method Detail</th>
                      <th className="p-4">Source</th>
                      <th className="p-4 text-right">Timestamp</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                  {evasionTechniques.map((item, i) => (
                      <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 text-white font-medium">{item.technique}</td>
                          <td className="p-4 text-gray-400">{item.method}</td>
                          <td className="p-4 text-secondary font-mono">{item.detected_in}</td>
                          <td className="p-4 text-right text-gray-400 font-mono">{item.time}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
}
