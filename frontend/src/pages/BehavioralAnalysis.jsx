
import React from 'react';
import { BrainCircuit, Fingerprint, EyeOff, ShieldAlert, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function BehavioralAnalysis() {
  const anomalies = [
      { id: 1, type: 'Process Restart Loop', detection: 'Heuristic', confidence: '98%', time: '10:45:00', details: 'svchost.exe restarting every 5s' },
      { id: 2, type: 'Mass File Encryption', detection: 'ML Model', confidence: '85%', time: '10:44:12', details: 'Rapid WriteOps in User Documents' },
      { id: 3, type: 'Memory Injection', detection: 'Hybrid', confidence: '92%', time: '10:30:00', details: 'Code cave usage in explorer.exe' },
  ];

  const chartData = [
    { name: '10:00', score: 10 },
    { name: '10:15', score: 15 },
    { name: '10:30', score: 80 },
    { name: '10:45', score: 65 },
    { name: '11:00', score: 40 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Behavioral Analysis Engine</h2>
        <p className="text-gray-400 mt-1">Machine Learning & Heuristic anomaly detection.</p>
      </div>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* ML Insight Panel */}
         <div className="lg:col-span-2 glass-card p-6">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <BrainCircuit className="text-secondary" /> Anomaly Timeline
             </h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#bd00ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#bd00ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#12121a', borderColor: '#333' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#bd00ff" 
                      fillOpacity={1} 
                      fill="url(#colorScore2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
         </div>

         {/* Model Status */}
         <div className="glass-card p-6 space-y-6">
             <div>
                 <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">ML Model Status</h3>
                 <div className="flex items-center gap-2 text-green-400 font-mono text-xl">
                     <span className="relative flex h-3 w-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                     </span>
                     ACTIVE - LEARNING
                 </div>
                 <p className="text-xs text-gray-500 mt-1">Last Retrain: 12 minutes ago</p>
             </div>
             
             <div>
                 <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Detection Confidence</h3>
                 <div className="w-full bg-white/10 rounded-full h-2">
                     <div className="bg-secondary h-2 rounded-full" style={{ width: '94%' }}></div>
                 </div>
                 <div className="flex justify-between text-xs text-gray-400 mt-1">
                     <span>Low</span>
                     <span>94% Accuracy</span>
                 </div>
             </div>
         </div>
     </div>

      <div className="glass-card">
          <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <Zap size={18} className="text-yellow-400" /> Recent Anomalies
              </h3>
          </div>
          <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                  <tr>
                      <th className="p-4">Anomaly Type</th>
                      <th className="p-4">Details</th>
                      <th className="p-4">Detection Method</th>
                      <th className="p-4">Time</th>
                      <th className="p-4 text-right">Confidence</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                  {anomalies.map((item, i) => (
                      <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 text-white font-bold">{item.type}</td>
                          <td className="p-4 text-gray-300">{item.details}</td>
                          <td className="p-4 text-gray-400">{item.detection}</td>
                          <td className="p-4 text-gray-400 font-mono">{item.time}</td>
                          <td className="p-4 text-right">
                              <span className="text-secondary font-bold">{item.confidence}</span>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
}
