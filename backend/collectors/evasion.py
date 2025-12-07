import re
import base64
import binascii

class Deobfuscator:
    def __init__(self):
        # Regex for common obfuscation patterns
        self.base64_pattern = re.compile(r'(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?')
        self.powershell_indicators = [
            "Invoke-Expression", "IEX", "FromBase64String", "-enc"
        ]

    def analyze_command_line(self, cmdline: str) -> dict:
        """
        Phase 8: Partial Anti-Evasion / De-obfuscation
        Attempts to detect and decode Base64 strings in command lines.
        """
        result = {
            "is_obfuscated": False,
            "decoded_content": [],
            "alerts": []
        }
        
        if not cmdline: return result
        
        # 1. PowerShell Check
        if "powershell" in cmdline.lower():
            for ind in self.powershell_indicators:
                if ind.lower() in cmdline.lower():
                    result["is_obfuscated"] = True
                    result["alerts"].append(f"Suspicious PowerShell Syntax: {ind}")

        # 2. Base64 Extraction
        # Heuristic: Find strings > 20 chars that look like valid B64
        potential_b64 = self.base64_pattern.findall(cmdline)
        for cand in potential_b64:
            if len(cand) > 20: 
                try:
                    decoded = base64.b64decode(cand).decode('utf-8', errors='ignore')
                    # If decoded contains readable text or high entropy, flag it
                    if len(decoded) > 10 and decoded.isprintable():
                        result["decoded_content"].append(decoded)
                        result["is_obfuscated"] = True
                        if "http" in decoded or "cmd" in decoded:
                            result["alerts"].append(f"Decoded Threat Payload: {decoded[:30]}...")
                except:
                    pass
        
        return result
