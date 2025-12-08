
import React from 'react';
import { Scale, HeartPulse, ShieldCheck, Activity, BarChart3, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function SystemIntegrity() {
  const radarData = [
    { subject: 'Kernel', A: 45, fullMark: 100 },
    { subject: 'Process', A: 90, fullMark: 100 },
    { subject: 'File Sys', A: 85, fullMark: 100 },
    { subject: 'Network', A: 50, fullMark: 100 },
    { subject: 'Memory', A: 70, fullMark: 100 },
    { subject: 'Boot', A: 100, fullMark: 100 },
  ];

  const integrityScore = 68;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">System Integrity Score</h2>
        <p className="text-gray-400 mt-1">Holistic health assessment based on all detection vectors.</p>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Score Gauge */}
          <div className="lg:col-span-1 glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
               <h3 className="text-gray-400 uppercase font-bold tracking-widest text-sm mb-4">Overall Integrity</h3>
               
               <div className="relative w-48 h-48 flex items-center justify-center">
                   {/* Simple SVG Circular Progress Mock */}
                   <svg className="w-full h-full transform -rotate-90">
                       <circle cx="96" cy="96" r="88" strokeWidth="12" stroke="#1a1a2e" fill="none" />
                       <circle cx="96" cy="96" r="88" strokeWidth="12" stroke="#00ff9d" fill="none" strokeDasharray="552" strokeDashoffset={552 - (552 * integrityScore) / 100} strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-5xl font-bold text-white">{integrityScore}%</span>
                       <span className="text-xs text-green-400 mt-1 font-bold uppercase">Compromised</span>
                   </div>
               </div>

               <div className="mt-6 flex flex-col gap-2 w-full">
                   <div className="flex justify-between text-sm">
                       <span className="text-gray-400">Baseline</span>
                       <span className="text-white font-bold">100%</span>
                   </div>
                   <div className="flex justify-between text-sm">
                       <span className="text-gray-400">Deviation</span>
                       <span className="text-red-400 font-bold">-32%</span>
                   </div>
               </div>
          </div>

          {/* Radar Chart Breakdown */}
          <div className="lg:col-span-2 glass-card p-6 flex flex-col">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                   <BarChart3 size={18} className="text-secondary" /> Vector Analysis
               </h3>
               <div className="flex-1 w-full h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Integrity"
                                dataKey="A"
                                stroke="#00ff9d"
                                strokeWidth={2}
                                fill="#00ff9d"
                                fillOpacity={0.2}
                            />
                        </RadarChart>
                   </ResponsiveContainer>
               </div>
          </div>
       </div>

       {/* Detailed Indicators */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="glass-card p-4 flex items-center gap-4">
               <div className="p-3 bg-red-500/10 rounded-lg text-red-500"><ShieldCheck size={24} /></div>
               <div>
                   <div className="text-xs text-gray-500 uppercase font-bold">Kernel Space</div>
                   <div className="text-xl font-bold text-red-500">Unstable</div>
               </div>
           </div>
           <div className="glass-card p-4 flex items-center gap-4">
               <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><Database size={24} /></div>
               <div>
                   <div className="text-xs text-gray-500 uppercase font-bold">File System</div>
                   <div className="text-xl font-bold text-green-500">Verified</div>
               </div>
           </div>
           <div className="glass-card p-4 flex items-center gap-4">
               <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500"><Activity size={24} /></div>
               <div>
                   <div className="text-xs text-gray-500 uppercase font-bold">User Space</div>
                   <div className="text-xl font-bold text-orange-500">Suspicious</div>
               </div>
           </div>
           <div className="glass-card p-4 flex items-center gap-4">
               <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><HeartPulse size={24} /></div>
               <div>
                   <div className="text-xs text-gray-500 uppercase font-bold">Heuristics</div>
                   <div className="text-xl font-bold text-blue-500">Learning</div>
               </div>
           </div>
       </div>
    </div>
  );
}
