import React from 'react';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

export function ProcessTable({ processes }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Shield className="text-primary" size={20} />
          Active Processes
        </h3>
        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
          Live Monitoring
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-4">PID</th>
              <th className="p-4">Name</th>
              <th className="p-4">User</th>
              <th className="p-4">Threads</th>
              <th className="p-4 text-right">Anomaly Score</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {processes.map((p) => {
              const isHighRisk = p.anomaly_score > 70;
              const isMediumRisk = p.anomaly_score > 40 && !isHighRisk;
              
              return (
                <tr 
                  key={p.pid} 
                  className={`hover:bg-white/5 transition-colors ${isHighRisk ? 'bg-danger/10 hover:bg-danger/20' : ''}`}
                >
                  <td className="p-4 font-mono text-gray-300">{p.pid}</td>
                  <td className="p-4 font-medium text-white">{p.name}</td>
                  <td className="p-4 text-gray-400">{p.username}</td>
                  <td className="p-4 text-gray-400">{p.num_threads}</td>
                  <td className="p-4 text-right font-mono">
                    <span className={`${isHighRisk ? 'text-danger' : isMediumRisk ? 'text-yellow-400' : 'text-primary'}`}>
                      {p.anomaly_score}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {isHighRisk ? (
                      <div className="inline-flex items-center gap-1 text-danger text-xs font-bold px-2 py-1 bg-danger/10 rounded-full">
                        <AlertTriangle size={12} /> THREAT
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-primary text-xs font-bold px-2 py-1 bg-primary/10 rounded-full">
                        <CheckCircle size={12} /> SECURE
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
