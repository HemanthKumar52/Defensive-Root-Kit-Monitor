import React, { useState } from 'react';
import { useMonitor } from './hooks/useMonitor';
import { StatsCard } from './components/StatsCard';
import { ProcessTable } from './components/ProcessTable';
import { Activity, Cpu, HardDrive, ShieldAlert, Zap, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const { data, loading, error, trainModel } = useMonitor();
  const [training, setTraining] = useState(false);

  const handleTrain = async () => {
    setTraining(true);
    await trainModel();
    // Simulate training delay for UI feedback
    setTimeout(() => setTraining(false), 2000);
  };

  if (loading && !data) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-primary animate-pulse">
      INITIALIZING SENTINEL...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-danger">
      SYSTEM ERROR: {error}
    </div>
  );

  const { stats, processes, timestamp } = data;

  // Mock Trend Data for the chart (in real app, use history)
  const chartData = [
    { name: 'T-60', risk: 10 },
    { name: 'T-45', risk: 25 },
    { name: 'T-30', risk: 15 },
    { name: 'T-15', risk: 80 },
    { name: 'Now', risk: stats.anomalies_detected * 10 + 20 }
  ];

  return (
    <div className="min-h-screen pb-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a2e] via-background to-background">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-surface/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldAlert className="text-primary" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              SENTINEL <span className="text-primary">CORE</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={handleTrain}
              disabled={training}
              className="px-4 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/50 text-secondary rounded-lg font-medium text-sm transition-all flex items-center gap-2"
            >
              <RefreshCw size={16} className={training ? "animate-spin" : ""} />
              {training ? "RETRAINING..." : "RETRAIN MODEL"}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-gray-400">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Hero Headers */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">System Overwatch</h2>
            <p className="text-gray-400 mt-1">Real-time rootkit & anomaly detection</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Active Processes" 
            value={stats.total_processes} 
            icon={Activity} 
            color="accent" 
          />
          <StatsCard 
            title="Threats Detected" 
            value={stats.anomalies_detected} 
            icon={ShieldAlert} 
            color={stats.anomalies_detected > 0 ? "danger" : "primary"} 
          />
          <StatsCard 
             title="Integrity Violations"
             value={stats.integrity_issues || 0}
             icon={ShieldAlert}
             color={stats.integrity_issues > 0 ? "warning" : "success"}
          />
          <StatsCard 
            title="System Risk" 
            value={`${stats.system_risk_score}/100`} 
            icon={Cpu} 
            color="secondary" 
          />
        </div>

        {/* ALERT: Integrity Issues */}
        {data.system_issues && data.system_issues.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 animate-bounce-slow">
             <h3 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                <ShieldAlert size={20} /> CRITICAL SYSTEM INTEGRITY ALERT
             </h3>
             <div className="space-y-2">
                {data.system_issues.map((issue, idx) => (
                   <div key={idx} className="flex items-center justify-between text-sm bg-black/20 p-2 rounded">
                      <span className="text-gray-300 font-mono">{issue.type}: {issue.path || issue.name}</span>
                      <span className="text-red-400 font-bold uppercase">{issue.severity}</span>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Monitor Table */}
          <div className="lg:col-span-2 space-y-6">
            <ProcessTable processes={processes} />
          </div>

          {/* Side Panel: Analyitcs */}
          <div className="space-y-6">
            
            {/* Thread Level Chart */}
            <div className="glass-card p-6">
              <h3 className="text-gray-400 font-medium mb-4 flex items-center gap-2">
                <Zap size={16} /> THREAT INTENSITY
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff0055" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ff0055" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#12121a', borderColor: '#333' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="#ff0055" 
                      fillOpacity={1} 
                      fill="url(#colorRisk)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions / Tips */}
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-2">Defense Matrix Active</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  All 11 Defensive Layers Active
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  P4-P5: ML & Signatures
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  P6-P8: Priv/Persist/Evasion
                </div>
                 <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  P9-P11: Resp/UI/Opt
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
