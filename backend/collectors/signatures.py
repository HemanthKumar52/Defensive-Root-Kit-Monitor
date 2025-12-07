import hashlib
import os
import pefile
from typing import Dict, Any

class SignatureScanner:
    def __init__(self):
        # Phase 5: Known Bad Hashes
        self.bad_hashes = {
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855": "Empty_File_Test"
        }
        # Phase 5 Advanced: Byte Pattern Engine (YARA-Lite)
        self.byte_patterns = [
            # Example: "MIMIKATZ" or "powershell -enc" strings in hex
            (b'\x4d\x69\x6d\x69\x6b\x61\x74\x7a', "String_Mimikatz"), 
            (b'powershell', "String_PowerShell_Script")
        ]
    
    def scan_file(self, filepath: str) -> Dict[str, Any]:
        result = {
            "detected": False,
            "threat_name": None,
            "meta": {}
        }
        
        if not os.path.exists(filepath):
            return result
            
        try:
            # 1. Hash Check
            sha256 = hashlib.sha256()
            file_content = b""
            with open(filepath, "rb") as f:
                file_content = f.read() 
                sha256.update(file_content)
            
            file_hash = sha256.hexdigest()
            if file_hash in self.bad_hashes:
                result["detected"] = True
                result["threat_name"] = self.bad_hashes[file_hash]
                return result # Return early on hash match
                
            # 2. Byte Pattern Scan (Phase 5 complete)
            for pattern, name in self.byte_patterns:
                if pattern in file_content:
                    result["detected"] = True
                    result["threat_name"] = name
                    result["meta"]["match_offset"] = file_content.find(pattern)
                    return result
            
            # 3. PE Header Analysis (Phase 5)
            # Check for high availability of PE features or packers
            pe = pefile.PE(data=file_content)
            
            # Check for suspicious sections (e.g. RWX sections)
            suspicious_sections = []
            for section in pe.sections:
                props = getattr(section, 'Characteristics', 0)
                # IMAGE_SCN_MEM_EXECUTE | IMAGE_SCN_MEM_WRITE | IMAGE_SCN_MEM_READ
                # 0x20000000 | 0x80000000 | 0x40000000
                if (props & 0xE0000000) == 0xE0000000:
                    suspicious_sections.append(section.Name.decode('utf-8', 'ignore').strip('\x00'))
            
            if suspicious_sections:
                result["meta"]["suspicious_sections"] = suspicious_sections
                # Raise alert if detected
                result["detected"] = True
                result["threat_name"] = result["threat_name"] or "Suspicious_RWX_Section"

        except Exception as e:
            result["meta"]["error"] = str(e)
            
        return result
