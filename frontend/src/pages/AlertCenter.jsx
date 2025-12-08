
import React, { useState } from 'react';
import { Bell, CheckCircle, Octagon, Play, Shield, Trash2, XCircle, AlertTriangle } from 'lucide-react';

export function AlertCenter() {
  const [alerts, setAlerts] = useState([
      { id: 101, pid: 4412, title: 'Hidden Kernel Module Detected', type: 'KERNEL', severity: 'CRITICAL', time: '14:22', status: 'Active' },
      { id: 102, pid: 5120, title: 'Process Hollowing: svchost.exe', type: 'MEMORY', severity: 'HIGH', time: '14:20', status: 'Investigating' },
      { id: 103, pid: null, title: 'Suspicious Registry Key Added', type: 'PERSISTENCE', severity: 'MEDIUM', time: '13:55', status: 'Active' },
      { id: 104, pid: 8821, title: 'Unusual Outbound Traffic (Port 4444)', type: 'NETWORK', severity: 'HIGH', time: '13:50', status: 'Resolved' },
  ]);

  const [processing, setProcessing] = useState(null);

  const handleAction = async (alertId, action, pid) => {
      setProcessing(alertId);
      
      // Simulate API delay
      await new Promise(r => setTimeout(r, 1000));

      if (action === 'kill' && pid) {
          try {
             // Real backend call would go here:
             // await fetch(`http://localhost:8000/api/response/terminate/${pid}`, { method: 'POST' });
             console.log(`Terminated PID ${pid}`);
          } catch(e) {
             console.error(e);
          }
      }

      setAlerts(prev => prev.map(a => {
          if (a.id === alertId) {
              return { ...a, status: 'Resolved' };
          }
          return a;
      }));
      setProcessing(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Alert & Response Center</h2>
        <p className="text-gray-400 mt-1">Manage incidents and execute automated response playbooks.</p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-red-500">
                  {alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'Resolved').length}
              </div>
              <div className="text-xs uppercase font-bold text-red-400 mt-1">Critical Active</div>
          </div>
          <div className="p-6 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-orange-500">
                  {alerts.filter(a => a.severity === 'HIGH' && a.status !== 'Resolved').length}
              </div>
              <div className="text-xs uppercase font-bold text-orange-400 mt-1">High Priority</div>
          </div>
          <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20 flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-green-500">
                  {alerts.filter(a => a.status === 'Resolved').length}
              </div>
              <div className="text-xs uppercase font-bold text-green-400 mt-1">Resolved Today</div>
          </div>
      </div>

      <div className="glass-card">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                   <Bell size={18} className="text-primary" /> Incident Queue
              </h3>
          </div>
          <div className="divide-y divide-white/5">
              {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                       <div className={`p-2 rounded-full ${
                           alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                           alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                           'bg-yellow-500/20 text-yellow-500'
                       }`}>
                           <Octagon size={20} />
                       </div>
                       
                       <div className="flex-1">
                           <div className="flex items-center gap-3">
                               <h4 className="text-white font-bold">{alert.title}</h4>
                               {alert.status === 'Resolved' && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle size={10} /> Resolved</span>}
                           </div>
                           <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 uppercase font-bold tracking-wider">
                               <span>{alert.type}</span>
                               <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                               <span>{alert.time}</span>
                               {alert.pid && (
                                   <>
                                     <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                     <span className="font-mono text-gray-400">PID: {alert.pid}</span>
                                   </>
                               )}
                           </div>
                       </div>

                       <div className={`flex items-center gap-2 transition-opacity ${alert.status === 'Resolved' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                           {processing === alert.id ? (
                               <span className="text-sm text-primary animate-pulse">Processing Action...</span>
                           ) : (
                               <>
                                   {alert.pid && (
                                       <button 
                                            onClick={() => handleAction(alert.id, 'kill', alert.pid)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded text-sm transition-colors"
                                       >
                                           <Trash2 size={14} /> Kill
                                       </button>
                                   )}
                                   <button 
                                        onClick={() => handleAction(alert.id, 'isolate')}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded text-sm transition-colors"
                                   >
                                       <Shield size={14} /> Isolate
                                   </button>
                                   <button 
                                        onClick={() => handleAction(alert.id, 'playbook')}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-sm transition-colors"
                                   >
                                       <Play size={14} /> Playbook
                                   </button>
                               </>
                           )}
                       </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
