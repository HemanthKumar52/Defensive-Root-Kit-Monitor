import psutil
import socket
from typing import List, Dict, Any

class NetworkMonitor:
    def __init__(self):
        # Mock Threat Intel Database (Phase 3)
        self.malicious_ips = {
            "185.199.108.153": "Suspicious CDN", 
            "45.33.32.156": "Known CnC",
            "0.0.0.0": "Listen Any" 
        }
        self.suspicious_ports = [4444, 6667, 1337, 31337] 
        
        # Stateful Tracking (Phase 3 Complete)
        # pid -> { remote_ip: [timestamps] }
        self.connection_history = {} 

    def _update_history(self, pid, remote_ip, timestamp):
        if pid not in self.connection_history:
            self.connection_history[pid] = {}
        if remote_ip not in self.connection_history[pid]:
            self.connection_history[pid][remote_ip] = []
        
        # Add timestamp
        self.connection_history[pid][remote_ip].append(timestamp)
        # Keep last 20 events
        if len(self.connection_history[pid][remote_ip]) > 20:
            self.connection_history[pid][remote_ip].pop(0)

    def _check_beaconing(self, pid, remote_ip) -> bool:
        timestamps = self.connection_history.get(pid, {}).get(remote_ip, [])
        if len(timestamps) < 4:
            return False
            
        # Calculate intervals
        intervals = [t2 - t1 for t1, t2 in zip(timestamps, timestamps[1:])]
        
        # If intervals are consistent (variance is low), it's a beacon
        # e.g., 30s, 31s, 29s, 30s
        avg = sum(intervals) / len(intervals)
        if avg < 1.0: return False # Too fast, like a download
        
        variance = sum((x - avg) ** 2 for x in intervals) / len(intervals)
        
        # Low variance = High Periodic Regularity = Beacon
        return variance < 2.0 

    def scan_connections(self) -> List[Dict[str, Any]]:
        threats = []
        import time
        now = time.time()
        
        try:
            # Requires elevated privileges for full visibility
            connections = psutil.net_connections(kind='inet')
            
            for conn in connections:
                laddr = conn.laddr
                raddr = conn.raddr
                pid = conn.pid
                status = conn.status
                
                risk_score = 0
                reasons = []

                if raddr:
                     self._update_history(pid, raddr.ip, now)
                     if self._check_beaconing(pid, raddr.ip):
                         risk_score += 50
                         reasons.append(f"Beaconing behavior detected to {raddr.ip}")

                # Check 1: Malicious Remote IP
                if raddr and raddr.ip in self.malicious_ips:
                    risk_score += 100
                    reasons.append(f"Connection to malicious IP: {self.malicious_ips[raddr.ip]}")

                # Check 2: Suspicious Ports 
                if status == 'LISTEN' and laddr.port in self.suspicious_ports:
                    risk_score += 80
                    reasons.append(f"Listening on suspicious port {laddr.port}")

                if risk_score > 0:
                    threats.append({
                        "pid": pid,
                        "local": f"{laddr.ip}:{laddr.port}",
                        "remote": f"{raddr.ip}:{raddr.port}" if raddr else "N/A",
                        "status": status,
                        "risk_score": risk_score,
                        "reasons": reasons
                    })
                    
        except Exception as e:
            print(f"Net Scan Error: {e}")
            
        return threats
