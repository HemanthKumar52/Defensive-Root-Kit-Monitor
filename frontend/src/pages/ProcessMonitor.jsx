
import React, { useState } from 'react';
import { useMonitor } from '../hooks/useMonitor';
import { ProcessTable } from '../components/ProcessTable';
import { ToggleLeft, ToggleRight, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

export function ProcessMonitor() {
  const { data, loading, refresh } = useMonitor();
  const [method, setMethod] = useState('all'); // 'all', 'winapi', 'ntquery', 'kernel'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (loading && !data) return (
    <div className="flex items-center justify-center h-full text-primary animate-pulse font-mono">
       SCANNING PROCESSES...
    </div>
  );

  // Filter processes based on selected method
  const filteredProcesses = data.processes.filter(p => {
      if (method === 'all') return true;
      if (method === 'winapi') return p.found_by_psutil;
      if (method === 'ntquery') return p.found_by_ntquery;
      if (method === 'kernel') return p.found_by_kernel;
      return true;
  });

  const getButtonStyle = (activeMethod) => {
      const isActive = method === activeMethod;
      return `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
          isActive 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'hover:bg-white/5 text-gray-400 border border-transparent'
      }`;
  };

  return (
    <div className="space-y-6">
       <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Process Enumeration</h2>
            <p className="text-gray-400 mt-1">Multi-method process detection & cross-verification</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 text-white"
            >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> 
                {isRefreshing ? "Scanning..." : "Refresh"}
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm transition-colors flex items-center gap-2">
                <Layers size={14} /> Compare Methods
            </button>
          </div>
      </div>

      {/* Method Toggles */}
      <div className="p-4 glass-card flex items-center gap-6">
        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Detection Methods:</span>
        
        <div className="flex items-center gap-2 text-sm">
            <button 
                onClick={() => setMethod('winapi')}
                className={getButtonStyle('winapi')}
            >
                {method === 'winapi' ? <CheckCircle2 size={16} /> : <ToggleRight size={16} />}
                WinAPI (User)
            </button>
            
            <span className="h-4 w-px bg-white/10 mx-2" />
            
            <button 
                onClick={() => setMethod('ntquery')}
                className={getButtonStyle('ntquery')}
            >
                {method === 'ntquery' ? <CheckCircle2 size={16} /> : <ToggleRight size={16} />}
                NtQuery (Native)
            </button>
            
            <span className="h-4 w-px bg-white/10 mx-2" />
            
            <button 
                onClick={() => setMethod('kernel')}
                className={getButtonStyle('kernel')}
            >
                {method === 'kernel' ? <CheckCircle2 size={16} /> : <ToggleLeft size={16} />}
                Kernel Object Scan (Root)
            </button>

             <span className="h-4 w-px bg-white/10 mx-2" />

             <button 
                onClick={() => setMethod('all')}
                className={getButtonStyle('all')}
            >
                All Sources
            </button>
        </div>
      </div>
      
      {/* Main Table */}
      <div className="glass-card p-1 relative min-h-[400px]">
        {filteredProcesses.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <p>No processes found with this method.</p>
                <p className="text-xs mt-1">Try switching to 'All Sources' or Refreshing.</p>
            </div>
        ) : (
            <>
                <div className="p-2 text-right text-xs text-gray-500 border-b border-white/5">
                    Showing {filteredProcesses.length} processes
                </div>
                <ProcessTable processes={filteredProcesses} />
            </>
        )}
      </div>
    </div>
  );
}
