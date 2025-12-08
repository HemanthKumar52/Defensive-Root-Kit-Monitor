
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Cpu, 
  FileCode, 
  Network, 
  Disc, 
  BrainCircuit, 
  Fingerprint, 
  EyeOff, 
  ShieldAlert, 
  Search, 
  Bell, 
  Scale, 
  Settings, 
  FileText 
} from 'lucide-react';

const MENU_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Processes', path: '/processes', icon: Activity },
  { label: 'Kernel Monitor', path: '/kernel', icon: Cpu },
  { label: 'File System', path: '/files', icon: FileCode },
  { label: 'Network', path: '/network', icon: Network },
  { label: 'Persistence', path: '/persistence', icon: Disc },
  { label: 'Behavioral', path: '/behavior', icon: BrainCircuit },
  { label: 'Signatures', path: '/signatures', icon: Fingerprint },
  { label: 'Anti-Evasion', path: '/anti-evasion', icon: EyeOff },
  { label: 'Privileges', path: '/privileges', icon: ShieldAlert },
  { label: 'Investigation', path: '/investigation', icon: Search },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Integrity Score', path: '/integrity', icon: Scale },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Reports', path: '/reports', icon: FileText },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-surface/80 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 overflow-y-auto z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ShieldAlert className="text-primary" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          SENTINEL <span className="text-primary">CORE</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 pb-6 space-y-1">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <item.icon size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono text-gray-400">ENGINE ACTIVE</span>
            </div>
            <div className="text-xs text-gray-500 font-mono">v1.2.4-stable</div>
        </div>
      </div>
    </div>
  );
}
