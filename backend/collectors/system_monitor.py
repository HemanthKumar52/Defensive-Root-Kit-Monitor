import psutil
import time
import platform
import os
import threading
from typing import List, Dict, Any, Set
try:
    from collectors.windows_api import get_processes_via_ntquery
except ImportError:
    def get_processes_via_ntquery(): return []

from collectors.integrity import SystemIntegrityMonitor
from collectors.network import NetworkMonitor
from collectors.signatures import SignatureScanner
from collectors.hook_scanner import HookScanner
try:
    from collectors.privileges import PrivilegeMonitor
except ImportError:
    class PrivilegeMonitor: 
        def check_process_token(self, p): return {}
        def virtual_uefi_scan(self): return []

from collectors.evasion import Deobfuscator

class SystemMonitor:
    def __init__(self):
        self.os_type = platform.system()
        self.running = False
        self._lock = threading.Lock()
        self.latest_snapshot = []
        
        # Sub-modules
        self.integrity_monitor = SystemIntegrityMonitor()
        self.network_monitor = NetworkMonitor()
        self.sig_scanner = SignatureScanner() 
        self.hook_scanner = HookScanner() 
        self.priv_monitor = PrivilegeMonitor() # Phase 6 & 7
        self.deobfuscator = Deobfuscator() # Phase 8
        
        # Suspicious parent-child relationships map
        self.suspicious_parents = {
            "svchost.exe": ["services.exe"],
            "lsass.exe": ["wininit.exe"],
            "services.exe": ["wininit.exe"],
            "wininit.exe": ["smss.exe", "n/a"],
            "smss.exe": ["System"],
            "csrss.exe": ["smss.exe"]
        }

    # ... [Keep existing _get_process_list_psutil and _get_process_list_native methods] ...

    def _get_process_list_psutil(self) -> Dict[int, Dict[str, Any]]:
        """Standard API enumeration"""
        procs = {}
        for proc in psutil.process_iter(['pid', 'ppid', 'name', 'username', 'create_time', 'cmdline', 'cpu_percent', 'memory_info', 'num_threads']):
            try:
                info = proc.info
                if info['name']: info['name'] = info['name'].lower()
                
                if info.get('memory_info'): info['memory_rss'] = info['memory_info'].rss
                else: info['memory_rss'] = 0

                info['source'] = 'psutil'
                procs[info['pid']] = info
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return procs

    def _get_process_list_native(self) -> Dict[int, Dict[str, Any]]:
        """Native API enumeration (Windows)"""
        if self.os_type != 'Windows': return {}
        try:
            raw_list = get_processes_via_ntquery()
            procs = {}
            for p in raw_list:
                pid = p['pid']
                name = p['name']
                if pid is None: continue 
                procs[pid] = {
                    'pid': pid,
                    'name': name.lower() if name else "",
                    'ppid': p['ppid'],
                    'source': 'ntquery'
                }
            return procs
        except Exception as e:
            return {}

    def analyze_processes(self, psutil_procs: Dict, native_procs: Dict) -> List[Dict[str, Any]]:
        all_pids = set(psutil_procs.keys()) | set(native_procs.keys())
        final_list = []
        
        # Network snapshot for correlation
        net_threats = {t['pid']: t for t in self.network_monitor.scan_connections()}
        
        for pid in all_pids:
            p_ps = psutil_procs.get(pid)
            p_nt = native_procs.get(pid)
            
            combined = p_ps.copy() if p_ps else p_nt.copy()
            if not combined: continue
            
            # Set Detection Flags
            combined['found_by_psutil'] = bool(p_ps)
            combined['found_by_ntquery'] = bool(p_nt)
            
            # Mock Kernel Scan for demo: assume system processes are verified by kernel
            # In real rootkit: specific callback results would be here
            is_system = combined.get('name') in ['system', 'registry', 'smss.exe', 'csrss.exe', 'wininit.exe', 'services.exe', 'lsass.exe']
            combined['found_by_kernel'] = is_system or bool(p_nt)
            
            combined['is_hidden'] = False
            combined['is_suspicious'] = False
            combined['anomalies'] = []
            
            # Phase 1: DKOM Check
            if self.os_type == 'Windows':
                if p_nt and not p_ps:
                    combined['is_hidden'] = True
                    combined['is_suspicious'] = True
                    combined['anomalies'].append("Hidden from standard API (DKOM?)")
                elif p_ps and not p_nt:
                     # Visible in API but hidden from Native? Rare but possible injection
                     combined['is_suspicious'] = True
                     combined['anomalies'].append("Ghost Process (Visible in API, missing in Native)")
            
            # Phase 1: Behavior (Parent-Child)
            name = combined.get('name', '')
            ppid = combined.get('ppid')
            if name in self.suspicious_parents:
                allowed = self.suspicious_parents[name]
                parent_proc = psutil_procs.get(ppid) or native_procs.get(ppid)
                pname = parent_proc.get('name') if parent_proc else ("System" if ppid in [0,4] else None)
                if pname and pname not in allowed:
                    combined['is_suspicious'] = True
                    combined['anomalies'].append(f"Unexpected Parent: {pname}")

            # Phase 3: Network Integration
            if pid in net_threats:
                threat = net_threats[pid]
                combined['is_suspicious'] = True
                combined['anomalies'].append(f"Network Threat: {threat['reasons']}")
                combined['network_risk'] = threat['risk_score']

            # Phase 6: Privilege Checks (Sampling for performace - do every 10th or just flag high risk)
            # In MVP, we only scan if already suspicious or high value process
            if combined['is_suspicious']:
                 priv_data = self.priv_monitor.check_process_token(pid)
                 if priv_data.get('dangerous_privileges'):
                     combined['is_suspicious'] = True # reinforce
                     combined['anomalies'].append(f"Dangerous Privs: {priv_data['dangerous_privileges']}")

            # Phase 8: Anti-Evasion (Deobfuscation)
            cmdline = combined.get('cmdline')
            if cmdline and isinstance(cmdline, list):
                full_cmd = " ".join(cmdline)
                evasion_res = self.deobfuscator.analyze_command_line(full_cmd)
                if evasion_res['is_obfuscated']:
                    combined['is_suspicious'] = True
                    combined['anomalies'].append("Obfuscated Command Line Detected")
                    if evasion_res['alerts']:
                        combined['anomalies'].extend(evasion_res['alerts'])

            final_list.append(combined)
            
        return final_list

    def monitor_loop(self, interval: int = 2):
        self.running = True
        while self.running:
            # 1. Collect Processes
            ps_procs = self._get_process_list_psutil()
            nt_procs = self._get_process_list_native()
            
            # 2. Analyze Processes (Phase 1, 3, 4, 6, 8)
            process_snapshot = self.analyze_processes(ps_procs, nt_procs)
            
            # 3. Collect System Integrity (Phase 2, 7)
            integrity_issues = self.integrity_monitor.check_integrity()
            registry_issues = self.integrity_monitor.check_registry_integrity()
            
            # Phase 7: UEFI/Bootkit Check
            boot_issues = self.priv_monitor.virtual_uefi_scan()
            if boot_issues:
                # Convert string list to dict objects for uniformity
                for b in boot_issues:
                    integrity_issues.append({"type": "UEFI_CONFIG_WEAKNESS", "path": "BCD/EFI", "severity": "CRITICAL"})
            
            # 4. Store Global State
            with self._lock:
                self.latest_snapshot = process_snapshot
                self.system_issues = integrity_issues + registry_issues
                
            time.sleep(interval)
            
    def get_system_issues(self):
        with self._lock:
            return getattr(self, 'system_issues', [])


    def start(self):
        t = threading.Thread(target=self.monitor_loop, daemon=True)
        t.start()
    
    def stop(self):
        self.running = False

    def get_latest_data(self):
        with self._lock:
            return self.latest_snapshot
