
import React from 'react';
import { ShieldAlert, Cpu, Activity, CheckCircle, AlertOctagon } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export function KernelMonitor() {
  // Mock Data for Kernel/SSDT Hooks
  const ssdtEntries = [
    { index: '0x001', name: 'NtOpenProcess', address: '0xFFFFF80004201100', module: 'ntoskrnl.exe', status: 'CLEAN' },
    { index: '0x002', name: 'NtCreateFile', address: '0xFFFFF80004201450', module: 'ntoskrnl.exe', status: 'CLEAN' },
    { index: '0x003', name: 'NtQuerySystemInformation', address: '0xFFFFF80765321000', module: 'UNKNOWN_MOD', status: 'HOOKED' },
    { index: '0x004', name: 'NtProtectVirtualMemory', address: '0xFFFFF80004202200', module: 'ntoskrnl.exe', status: 'CLEAN' },
    { index: '0x005', name: 'NtWriteVirtualMemory', address: '0xFFFFF80004203300', module: 'ntoskrnl.exe', status: 'CLEAN' },
  ];

  const drivers = [
      { name: 'fltmgr.sys', base: '0xFFFFF80001000000', size: '0x50000', signed: true },
      { name: 'klif.sys', base: '0xFFFFF80001200000', size: '0x85000', signed: true },
      { name: 'rootkit_driver.sys', base: '0xFFFFF80004500000', size: '0x12000', signed: false },
      { name: 'ntfs.sys', base: '0xFFFFF80001400000', size: '0x150000', signed: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Kernel Integrity Monitor</h2>
            <p className="text-gray-400 mt-1">Deep system verification: SSDT, IDT, and Driver Objects</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-mono text-sm flex items-center gap-2">
                <AlertOctagon size={14} /> 1 HOOK DETECTED
            </span>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="SSDT Entries Scanned" value="482" icon={Activity} color="primary" />
          <StatsCard title="Hooks Detected" value="1" icon={ShieldAlert} color="danger" />
          <StatsCard title="Hidden Drivers" value="0" icon={Cpu} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SSDT Table */}
          <div className="glass-card flex flex-col">
              <div className="p-4 border-b border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2">
                      <Cpu size={18} className="text-secondary" /> System Service Descriptor Table (SSDT)
                  </h3>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                          <tr>
                              <th className="p-3">Index</th>
                              <th className="p-3">Function</th>
                              <th className="p-3">Module</th>
                              <th className="p-3 text-right">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {ssdtEntries.map((row, i) => (
                              <tr key={i} className={`hover:bg-white/5 ${row.status === 'HOOKED' ? 'bg-red-500/10' : ''}`}>
                                  <td className="p-3 font-mono text-gray-400">{row.index}</td>
                                  <td className="p-3 text-white font-medium">{row.name}</td>
                                  <td className="p-3 text-gray-400 font-mono text-xs">{row.module}</td>
                                  <td className="p-3 text-right">
                                      {row.status === 'HOOKED' ? (
                                          <span className="text-red-500 font-bold text-xs px-2 py-1 bg-red-500/10 rounded">HOOKED</span>
                                      ) : (
                                          <span className="text-green-500 font-bold text-xs px-2 py-1 bg-green-500/10 rounded">CLEAN</span>
                                      )}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Loaded Drivers */}
          <div className="glass-card flex flex-col">
              <div className="p-4 border-b border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2">
                      <Activity size={18} className="text-secondary" /> Kernel Modules
                  </h3>
              </div>
              <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                          <tr>
                              <th className="p-3">Driver Name</th>
                              <th className="p-3">Base Address</th>
                              <th className="p-3 text-right">Signature</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {drivers.map((drv, i) => (
                              <tr key={i} className="hover:bg-white/5">
                                  <td className="p-3 text-white font-medium">{drv.name}</td>
                                  <td className="p-3 text-gray-400 font-mono text-xs">{drv.base}</td>
                                  <td className="p-3 text-right">
                                      {drv.signed ? (
                                           <CheckCircle size={16} className="text-green-500 inline" />
                                      ) : (
                                           <span className="text-orange-500 font-bold text-xs px-2 py-1 bg-orange-500/10 rounded">UNSIGNED</span>
                                      )}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
}
