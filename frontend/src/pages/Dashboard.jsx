
import React, { useState } from 'react';
import { useMonitor } from '../hooks/useMonitor';
import { StatsCard } from '../components/StatsCard';
import { ShieldAlert, Activity, Cpu, Eye, AlertTriangle, Terminal, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { data, loading, error, trainModel } = useMonitor();
  const [training, setTraining] = useState(false);

  const handleTrain = async () => {
    setTraining(true);
    await trainModel();
    setTimeout(() => setTraining(false), 2000);
  };

  if (loading && !data) return (
    <div className="flex items-center justify-center h-full text-primary animate-pulse font-mono tracking-widest">
      INITIALIZING SENTINEL CORE...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-full text-danger font-mono">
      SYSTEM ERROR: {error}
    </div>
  );

  const { stats } = data;

  // Mock Trend Data
  const chartData = [
    { name: '00:00', score: 12 },
    { name: '04:00', score: 15 },
    { name: '08:00', score: 45 },
    { name: '12:00', score: 30 },
    { name: '16:00', score: stats.system_risk_score },
  ];

  // Mock Live Feed Logs
  const detectionLogs = [
    { id: 1, type: 'KERNEL', message: 'SSDT Hook detection failed on NtOpenProcess', severity: 'critical', time: '19:14:22' },
    { id: 2, type: 'PROCESS', message: 'Hidden process found: pid 4452 (svchost.exe)', severity: 'high', time: '19:14:20' },
    { id: 3, type: 'NETWORK', message: 'Outbound connection to known C2 IP: 192.168.1.55', severity: 'medium', time: '19:14:15' },
    { id: 4, type: 'FILE', message: 'New executable created in System32: update_svc.exe', severity: 'low', time: '19:13:45' },
    { id: 5, type: 'MEMORY', message: 'RWX memory page detected in pid 1120', severity: 'medium', time: '19:12:30' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Overwatch</h2>
          <p className="text-gray-400 mt-1">Real-time rootkit & anomaly detection dashboard</p>
        </div>
        <button 
          onClick={handleTrain}
          disabled={training}
          className="px-4 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/50 text-secondary rounded-lg font-medium text-sm transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} className={training ? "animate-spin" : ""} />
          {training ? "RETRAINING..." : "RETRAIN MODEL"}
        </button>
      </div>

      {/* Critical Threat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Threat Severity" 
          value={stats.system_risk_score > 75 ? "CRITICAL" : stats.system_risk_score > 50 ? "HIGH" : "LOW"} 
          icon={ShieldAlert} 
          color={stats.system_risk_score > 50 ? "danger" : "primary"} 
        />
        <StatsCard 
          title="Active Indicators" 
          value={stats.anomalies_detected} 
          icon={Activity} 
          color={stats.anomalies_detected > 0 ? "warning" : "success"}
        />
        <StatsCard 
          title="Hidden Processes" 
          value={data.processes.filter(p => p.risk_level === 'critical').length} 
          icon={Eye} 
          color="accent" 
        />
        <StatsCard 
          title="Kernel Status" 
          value={stats.integrity_issues > 0 ? "COMPROMISED" : "SECURE"} 
          icon={Cpu} 
          color={stats.integrity_issues > 0 ? "danger" : "success"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-Time Detection Feed */}
        <div className="lg:col-span-2 glass-card p-6 min-h-[400px]">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Terminal size={20} className="text-primary" />
            Real-Time Detection Feed
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {detectionLogs.map((log) => (
              <div key={log.id} className="group flex items-start gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                <div className={`mt-1 p-1.5 rounded-full ${
                  log.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                  log.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                  log.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  <AlertTriangle size={14} />
                </div>
                <div className="flex-1">
                   <div className="flex items-center justify-between">
                     <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        log.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                        log.severity === 'high' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-blue-500/10 text-blue-400'
                     }`}>
                       {log.type}
                     </span>
                     <span className="text-xs font-mono text-gray-500">{log.time}</span>
                   </div>
                   <p className="text-sm text-gray-300 mt-1 font-mono">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Compromise Score */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-gray-400 font-medium mb-4 flex items-center gap-2">
            <Activity size={16} /> SYSTEM COMPROMISE SCORE
          </h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff0055" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff0055" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12121a', borderColor: '#333' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#ff0055" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
             <div>
                <span className="text-xs text-gray-500">Current Score</span>
                <div className="text-2xl font-bold text-white">{stats.system_risk_score}</div>
             </div>
             <div>
                <span className="text-xs text-gray-500">Peak (24h)</span>
                <div className="text-2xl font-bold text-gray-400">45</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
