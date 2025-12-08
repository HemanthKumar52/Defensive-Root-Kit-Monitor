
import React from 'react';
import { Network, Globe, AlertTriangle, Radio } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export function NetworkMonitor() {
  const connections = [
      { pid: 4522, process: 'svchost.exe', proto: 'TCP', local: '192.168.1.10:4921', remote: '104.21.55.2:443', status: 'VISIBLE', risk: 'LOW' },
      { pid: 0, process: 'Unknown (Kernel)', proto: 'UDP', local: '0.0.0.0:0', remote: '185.100.22.1:53', status: 'HIDDEN', risk: 'CRITICAL' },
      { pid: 8821, process: 'chrome.exe', proto: 'TCP', local: '192.168.1.10:5512', remote: '172.217.16.14:443', status: 'VISIBLE', risk: 'LOW' },
      { pid: 1120, process: 'powershell.exe', proto: 'TCP', local: '192.168.1.10:31337', remote: '45.33.22.11:4444', status: 'VISIBLE', risk: 'HIGH' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Network Rootkit Monitor</h2>
        <p className="text-gray-400 mt-1">Cross-referencing user-mode APIs with NDIS filter drivers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Active Connections" value="42" icon={Network} color="primary" />
          <StatsCard title="Hidden Sockets" value="1" icon={AlertTriangle} color="danger" />
          <StatsCard title="C2 Beacons" value="1" icon={Radio} color="warning" />
          <StatsCard title="Packet Filter" value="ACTIVE" icon={Globe} color="success" />
      </div>

      <div className="glass-card">
          <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <Network size={18} className="text-primary" /> Active Network Flow
              </h3>
          </div>
          <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                  <tr>
                      <th className="p-4">Process</th>
                      <th className="p-4">Protocol</th>
                      <th className="p-4">Local Address</th>
                      <th className="p-4">Remote Address</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4 text-right">Risk</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                  {connections.map((conn, i) => (
                      <tr key={i} className={`hover:bg-white/5 ${conn.status === 'HIDDEN' ? 'bg-red-500/5' : ''}`}>
                          <td className="p-4">
                              <div className="text-white font-medium">{conn.process}</div>
                              <div className="text-xs text-gray-500 font-mono">PID: {conn.pid}</div>
                          </td>
                          <td className="p-4 text-gray-400">{conn.proto}</td>
                          <td className="p-4 text-gray-400 font-mono">{conn.local}</td>
                          <td className="p-4 text-gray-400 font-mono">{conn.remote}</td>
                          <td className="p-4">
                               {conn.status === 'HIDDEN' ? (
                                   <div className="inline-flex items-center gap-1 text-red-500 text-xs font-bold px-2 py-1 bg-red-500/10 rounded">
                                       HIDDEN (ROOTKIT)
                                   </div>
                               ) : (
                                   <div className="inline-flex items-center gap-1 text-gray-500 text-xs font-bold px-2 py-1 bg-white/5 rounded">
                                       Standard
                                   </div>
                               )}
                          </td>
                          <td className="p-4 text-right">
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                  conn.risk === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                                  conn.risk === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                                  'bg-green-500/10 text-green-500'
                              }`}>
                                  {conn.risk}
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
