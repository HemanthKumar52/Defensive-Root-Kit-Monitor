
import React from 'react';
import { ShieldAlert, UserCheck, Key, Lock, AlertOctagon } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export function PrivilegeMonitor() {
  const privilegeEvents = [
      { event: 'Token Adjustment', process: 'spoolsv.exe', privilege: 'SeDebugPrivilege', status: 'BLOCKED', severity: 'HIGH' },
      { event: 'UAC Bypass', process: 'mmc.exe', privilege: 'High Integrity', status: 'DETECTED', severity: 'CRITICAL' },
      { event: 'LSASS Access', process: 'mimikatz.exe', privilege: 'PROCESS_ALL_ACCESS', status: 'BLOCKED', severity: 'CRITICAL' },
      { event: 'Privilege Use', process: 'lsass.exe', privilege: 'SeTcbPrivilege', status: 'ALLOWED', severity: 'LOW' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Privilege Escalation Monitor</h2>
        <p className="text-gray-400 mt-1">Tracking unauthorized token manipulation and UAC bypass attempts.</p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Privilege Spikes" value="2" icon={ShieldAlert} color="danger" />
          <StatsCard title="UAC Bypasses" value="1" icon={Lock} color="warning" />
          <StatsCard title="LSASS Access" value="BLOCKED" icon={Key} color="success" />
          <StatsCard title="System Users" value="3" icon={UserCheck} color="primary" />
      </div>

      <div className="glass-card">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                   <AlertOctagon size={18} className="text-danger" /> Critical Privilege Events
              </h3>
          </div>
          <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                  <tr>
                      <th className="p-4">Event Type</th>
                      <th className="p-4">Process</th>
                      <th className="p-4">Target Privilege</th>
                      <th className="p-4">Action Taken</th>
                      <th className="p-4 text-right">Severity</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                  {privilegeEvents.map((item, i) => (
                      <tr key={i} className={`hover:bg-white/5 ${item.severity === 'CRITICAL' ? 'bg-red-500/5' : ''}`}>
                          <td className="p-4 text-white font-medium">{item.event}</td>
                          <td className="p-4 text-gray-300 font-mono">{item.process}</td>
                          <td className="p-4 text-gray-400 font-mono text-xs">{item.privilege}</td>
                          <td className="p-4">
                               <span className={`text-xs font-bold px-2 py-1 rounded ${
                                   item.status === 'BLOCKED' ? 'bg-green-500/10 text-green-500' : 
                                   item.status === 'DETECTED' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/20 text-gray-400'
                               }`}>
                                   {item.status}
                               </span>
                          </td>
                          <td className="p-4 text-right">
                              <span className={`text-xs font-bold ${
                                  item.severity === 'CRITICAL' ? 'text-danger' : 
                                  item.severity === 'HIGH' ? 'text-orange-500' : 'text-gray-500'
                              }`}>
                                  {item.severity}
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
