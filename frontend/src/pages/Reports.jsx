
import React from 'react';
import { FileText, Download, Printer, Share2, ClipboardList } from 'lucide-react';

export function Reports() {
  const reports = [
      { id: 'RPT-2023-001', title: 'Start-of-Day System Audit', date: '2023-10-25 09:00', type: 'ROUTINE', size: '2.4 MB' },
      { id: 'RPT-2023-002', title: 'Incident Response: PID 4452', date: '2023-10-25 14:30', type: 'INCIDENT', size: '15.1 MB' },
      { id: 'RPT-2023-003', title: 'Integrity Verification Check', date: '2023-10-25 18:00', type: 'ROUTINE', size: '1.8 MB' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">System Reports</h2>
        <p className="text-gray-400 mt-1">Generate, view, and export detailed forensic reports.</p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <button className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group cursor-pointer border-dashed border-2 bg-transparent">
               <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                   <FileText size={32} />
               </div>
               <span className="font-bold text-white">Generate Full Audit</span>
           </button>
           <button className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group cursor-pointer border-dashed border-2 bg-transparent">
               <div className="p-4 rounded-full bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
                   <ClipboardList size={32} />
               </div>
               <span className="font-bold text-white">Export IOC List</span>
           </button>
           <button className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group cursor-pointer border-dashed border-2 bg-transparent">
               <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                   <Share2 size={32} />
               </div>
               <span className="font-bold text-white">Share Evidence Package</span>
           </button>
       </div>

      <div className="glass-card">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                   <FileText size={18} className="text-gray-400" /> Recent Reports
              </h3>
          </div>
          <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                  <tr>
                      <th className="p-4">Report ID</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Date Generated</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Size</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                  {reports.map((rpt, i) => (
                      <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 font-mono text-gray-400">{rpt.id}</td>
                          <td className="p-4 text-white font-medium">{rpt.title}</td>
                          <td className="p-4 text-gray-400">{rpt.date}</td>
                          <td className="p-4">
                               <span className={`text-xs font-bold px-2 py-1 rounded ${
                                   rpt.type === 'INCIDENT' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                               }`}>
                                   {rpt.type}
                               </span>
                          </td>
                          <td className="p-4 text-gray-400 font-mono">{rpt.size}</td>
                          <td className="p-4 text-right flex items-center justify-end gap-2">
                              <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors" title="Download">
                                  <Download size={16} />
                              </button>
                               <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors" title="Print">
                                  <Printer size={16} />
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
}
