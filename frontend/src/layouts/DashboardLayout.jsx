
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a2e] via-background to-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 transition-all">
        <div className="max-w-7xl mx-auto space-y-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
