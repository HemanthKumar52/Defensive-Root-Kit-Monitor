
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { ProcessMonitor } from './pages/ProcessMonitor';

// Core Modules
import { KernelMonitor } from './pages/KernelMonitor';
import { FileIntegrity } from './pages/FileIntegrity';
import { NetworkMonitor } from './pages/NetworkMonitor';
import { PersistenceScanner } from './pages/PersistenceScanner';
import { BehavioralAnalysis } from './pages/BehavioralAnalysis';

// Extended Modules
import { SignatureDetection } from './pages/SignatureDetection';
import { AntiEvasion } from './pages/AntiEvasion';
import { PrivilegeMonitor } from './pages/PrivilegeMonitor';
import { InvestigationWorkspace } from './pages/InvestigationWorkspace';
import { AlertCenter } from './pages/AlertCenter';
import { SystemIntegrity } from './pages/SystemIntegrity';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/processes" element={<ProcessMonitor />} />
          <Route path="/kernel" element={<KernelMonitor />} />
          <Route path="/files" element={<FileIntegrity />} />
          <Route path="/network" element={<NetworkMonitor />} />
          <Route path="/persistence" element={<PersistenceScanner />} />
          <Route path="/behavior" element={<BehavioralAnalysis />} />
          
          <Route path="/signatures" element={<SignatureDetection />} />
          <Route path="/anti-evasion" element={<AntiEvasion />} />
          <Route path="/privileges" element={<PrivilegeMonitor />} />
          <Route path="/investigation" element={<InvestigationWorkspace />} />
          <Route path="/alerts" element={<AlertCenter />} />
          <Route path="/integrity" element={<SystemIntegrity />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
