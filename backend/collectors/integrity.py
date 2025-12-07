import hashlib
import os
import winreg
from typing import List, Dict, Any

class SystemIntegrityMonitor:
    def __init__(self):
        self.critical_files = [
            r"C:\Windows\System32\notepad.exe",
            r"C:\Windows\System32\calc.exe",
            r"C:\Windows\System32\drivers\etc\hosts"
        ]
        self.baseline_hashes = {}
        # Initialize baseline
        for f in self.critical_files:
            if os.path.exists(f):
                self.baseline_hashes[f] = self._calculate_hash(f)
                
    def _calculate_hash(self, filepath: str) -> str:
        try:
            sha256_hash = hashlib.sha256()
            with open(filepath, "rb") as f:
                # Read in chunks
                for byte_block in iter(lambda: f.read(4096), b""):
                    sha256_hash.update(byte_block)
            return sha256_hash.hexdigest()
        except:
            return ""

    def check_integrity(self) -> List[Dict[str, Any]]:
        anomalies = []
        for f, original_hash in self.baseline_hashes.items():
            if not os.path.exists(f):
                anomalies.append({
                    "type": "file_missing",
                    "path": f,
                    "severity": "high"
                })
                continue
                
            current_hash = self._calculate_hash(f)
            if current_hash != original_hash:
                anomalies.append({
                    "type": "integrity_violation",
                    "path": f,
                    "expected": original_hash,
                    "actual": current_hash,
                    "severity": "critical"
                })
        return anomalies

    def check_registry_integrity(self) -> List[Dict[str, Any]]:
        # Check standard autorun keys
        # This covers Phase 2 (Integrity) and Phase 7 (Persistence)
        anomalies = []
        locations = [
            (winreg.HKEY_LOCAL_MACHINE, r"Software\Microsoft\Windows\CurrentVersion\Run"),
            (winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run")
        ]
        
        for hkey, path in locations:
            try:
                with winreg.OpenKey(hkey, path, 0, winreg.KEY_READ) as key:
                    i = 0
                    while True:
                        try:
                            name, value, _ = winreg.EnumValue(key, i)
                            # Heuristic: Check for unusual binaries in AppData or Temp
                            if "AppData" in value or "Temp" in value:
                                anomalies.append({
                                    "type": "suspicious_autorun",
                                    "key": path,
                                    "name": name,
                                    "value": value,
                                    "severity": "medium"
                                })
                            i += 1
                        except WindowsError:
                            break
            except WindowsError:
                pass
                
        return anomalies
