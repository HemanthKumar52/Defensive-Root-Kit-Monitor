
import React from 'react';
import { Disc, PlayCircle, Settings, FileCog, AlertCircle } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export function PersistenceScanner() {
  const persistenceItems = [
      { name: 'OneDrive Update', location: 'HKCU\\...\\Run', path: 'C:\\Users\\...\\OneDrive.exe', type: 'Registry', status: 'VERIFIED' },
      { name: 'UpdaterService', location: 'Services', path: 'C:\\ProgramData\\updater.exe', type: 'Service', status: 'SUSPICIOUS' },
      { name: 'SecurityHealth', location: 'HKLM\\...\\Run', path: '%windir%\\system32\\SecurityHealthSystray.exe', type: 'Registry', status: 'VERIFIED' },
      { name: 'MaliciousTask', location: 'Task Scheduler', path: 'powershell.exe -Enc ...', type: 'Task', status: 'MALICIOUS' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Persistence Mechanisms</h2>
        <p className="text-gray-400 mt-1">Detection of registry keys, services, tasks, and WMI subscriptions used for survival.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Autoruns Scanned" value="1,204" icon={Disc} color="primary" />
          <StatsCard title="Suspicious Entries" value="2" icon={AlertCircle} color="warning" />
          <StatsCard title="Services" value="240" icon={Settings} color="secondary" />
          <StatsCard title="Scheduled Tasks" value="84" icon={FileCog} color="secondary" />
      </div>

      <div className="glass-card">
          <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <PlayCircle size={18} className="text-primary" /> Startup & Persistence Entries
              </h3>
          </div>
          <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                  <tr>
                      <th className="p-4">Entry Name</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Command / Path</th>
                      <th className="p-4">Type</th>
                      <th className="p-4 text-right">Analysis</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                  {persistenceItems.map((item, i) => (
                      <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 text-white font-medium">{item.name}</td>
                          <td className="p-4 text-gray-400 text-xs font-mono">{item.location}</td>
                          <td className="p-4 text-gray-400 text-xs font-mono break-all max-w-md">{item.path}</td>
                          <td className="p-4 text-gray-400">{item.type}</td>
                          <td className="p-4 text-right">
                              <span className={`text-xs font-bold px-2 py-1 rounded cursor-pointer ${
                                  item.status === 'MALICIOUS' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                  item.status === 'SUSPICIOUS' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                  'bg-green-500/10 text-green-500'
                              }`}>
                                  {item.status}
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
