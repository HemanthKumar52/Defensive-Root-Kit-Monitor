
import React from 'react';
import { Fingerprint, Search, FileCode, Hash, ShieldCheck, Database } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export function SignatureDetection() {
  const hashMatches = [
      { filename: 'svchost_miner.exe', hash: 'a1b2c3d4...', status: 'QUARANTINED', db: 'VirusTotal', severity: 'CRITICAL' },
      { filename: 'unknown_driver.sys', hash: 'e5f6g7h8...', status: 'DETECTED', db: 'Local DB', severity: 'HIGH' },
  ];

  const yaraRules = [
      { name: 'APT_Hidden_Process', type: 'Memory', matches: 12, confidence: 'High' },
      { name: 'Reflective_DLL_Load', type: 'Memory', matches: 1, confidence: 'Medium' },
      { name: 'Suspicious_Packer', type: 'File', matches: 45, confidence: 'Low' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Signature-Based Detection</h2>
        <p className="text-gray-400 mt-1">Direct pattern matching against known malware hashes and YARA rules.</p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Known Threats" value="2" icon={Database} color="danger" />
          <StatsCard title="YARA Signatures" value="1,450" icon={FileCode} color="primary" />
          <StatsCard title="Quarantined Files" value="1" icon={ShieldCheck} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Hash Database */}
          <div className="glass-card">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                       <Hash size={18} className="text-primary" /> Hash Database Hits
                  </h3>
              </div>
              <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                      <tr>
                          <th className="p-3">Filename</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Severity</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {hashMatches.map((item, i) => (
                          <tr key={i} className="hover:bg-white/5">
                              <td className="p-3 text-white">
                                  {item.filename}
                                  <div className="text-xs text-gray-500 font-mono truncate w-24">{item.hash}</div>
                              </td>
                              <td className="p-3">
                                   <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded">{item.status}</span>
                              </td>
                              <td className="p-3 text-right">
                                  <span className="text-red-500 text-xs font-bold px-2 py-1 bg-red-500/10 rounded">{item.severity}</span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* YARA Rules */}
          <div className="glass-card">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                       <FileCode size={18} className="text-secondary" /> Active YARA Rules
                  </h3>
                  <button className="text-xs text-primary border border-primary/20 px-2 py-1 rounded hover:bg-primary/10">
                      + Add Rule
                  </button>
              </div>
              <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                      <tr>
                          <th className="p-3">Rule Name</th>
                          <th className="p-3">Target</th>
                          <th className="p-3 text-right">Matches</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {yaraRules.map((rule, i) => (
                          <tr key={i} className="hover:bg-white/5">
                              <td className="p-3 text-white font-medium">{rule.name}</td>
                              <td className="p-3 text-gray-400">{rule.type}</td>
                              <td className="p-3 text-right font-mono">{rule.matches}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
}
