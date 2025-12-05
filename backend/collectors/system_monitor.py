import psutil
import time
import platform
import os
import threading
from typing import List, Dict, Any

class SystemMonitor:
    def __init__(self):
        self.os_type = platform.system()
        self.running = False
        self._lock = threading.Lock()
        self.latest_snapshot = []

    def get_process_list(self) -> List[Dict[str, Any]]:
        """
        Collects metadata for all running processes.
        """
        processes = []
        for proc in psutil.process_iter(['pid', 'ppid', 'name', 'username', 'create_time', 'cmdline']):
            try:
                info = proc.info
                # Add derived features
                info['num_threads'] = proc.num_threads()
                try:
                    info['memory_info'] = proc.memory_info().rss
                except:
                    info['memory_info'] = 0
                
                # Mock syscall activity for demonstration (since we can't easily strace all)
                # In a real tool, this would come from an eBPF map or ETW consumer.
                info['syscall_rate'] = 0  
                
                processes.append(info)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
        return processes

    def check_hidden_processes(self) -> List[int]:
        """
        Naive check for hidden processes by comparing /proc (Linux) with ps output.
        Returns a list of PIDs that are visible in /proc but not in psutil (if any).
        """
        if self.os_type != 'Linux':
            return []
        
        try:
            pids_ps = set(p.pid for p in psutil.process_iter())
            pids_proc = set(int(pid) for pid in os.listdir('/proc') if pid.isdigit())
            hidden = list(pids_proc - pids_ps)
            return hidden
        except Exception:
            return []

    def monitor_loop(self, interval: int = 2):
        self.running = True
        while self.running:
            snapshot = self.get_process_list()
            with self._lock:
                self.latest_snapshot = snapshot
            time.sleep(interval)

    def start(self):
        t = threading.Thread(target=self.monitor_loop, daemon=True)
        t.start()
    
    def stop(self):
        self.running = False

    def get_latest_data(self):
        with self._lock:
            return self.latest_snapshot
