
import React from 'react';
import { FileCode, AlertTriangle, ShieldCheck, Database, FileDigit, HardDrive } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export function FileIntegrity() {
  const modifications = [
      { path: 'C:\\Windows\\System32\\drivers\\etc\\hosts', type: 'MODIFIED', severity: 'HIGH', time: '10:42:01' },
      { path: 'C:\\Windows\\System32\\kernel32.dll', type: 'INTEGRITY_FAIL', severity: 'CRITICAL', time: '10:41:55' },
      { path: 'C:\\Program Files\\Unknown\\miner.exe', type: 'CREATED_HIDDEN', severity: 'HIGH', time: '10:30:22' },
      { path: 'C:\\Windows\\explorer.exe', type: 'VERIFIED', severity: 'CLEAN', time: '10:00:00' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">File System Integrity</h2>
        <p className="text-gray-400 mt-1">Real-time monitoring of critical files, ADS, and MBR verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Files Monitored" value="12,504" icon={FileCode} color="primary" />
          <StatsCard title="Integrity Failures" value="2" icon={AlertTriangle} color="danger" />
          <StatsCard title="New Hidden Files" value="1" icon={FileDigit} color="warning" />
          <StatsCard title="MBR Status" value="SECURE" icon={HardDrive} color="success" />
      </div>

      <div className="glass-card">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <Database size={18} className="text-primary" /> Critical File Monitor
              </h3>
              <div className="flex gap-2">
                   <span className="text-xs font-mono text-gray-400">Baseline Hash: SHA-256</span>
              </div>
          </div>
          <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                  <tr>
                      <th className="p-4">File Path</th>
                      <th className="p-4">Event Type</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 text-right">Severity</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                  {modifications.map((file, i) => (
                      <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 font-mono text-gray-300">{file.path}</td>
                          <td className="p-4">
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                  file.type === 'VERIFIED' ? 'bg-green-500/10 text-green-500' : 'bg-white/10 text-white'
                              }`}>
                                  {file.type}
                              </span>
                          </td>
                          <td className="p-4 text-gray-400">{file.time}</td>
                          <td className="p-4 text-right">
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                  file.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                                  file.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                                  'bg-green-500/10 text-green-500'
                              }`}>
                                  {file.severity}
                              </span>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
}
