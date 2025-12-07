from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from collectors.system_monitor import SystemMonitor
from ml.anomaly_detector import AnomalyDetector
import asyncio
import uvicorn
import psutil
import time

app = FastAPI(title="Defensive Rootkit Monitor")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Components
# Components
monitor = SystemMonitor()
detector = AnomalyDetector()

# Global state
monitor.start()

@app.get("/api/status")
def get_status():
    data = monitor.get_latest_data()
    return {
        "status": "active", 
        "monitored_processes": len(data),
        "monitoring_mode": "Full Spectrum (Kernel+User+Net+ML)",
        "phases_active": [
            "P1: Process",
            "P2: Integrity",
            "P3: Network",
            "P4: Behavioral ML",
            "P5: Signatures",
            "P6: Privilege",
            "P7: Persistence",
            "P8: Anti-Evasion",
            "P9: Response",
            "P10: Real-time UI",
            "P11: Optimization"
        ]
    }

@app.get("/api/dashboard")
def get_dashboard_data():
    raw_data = monitor.get_latest_data()
    system_issues = monitor.get_system_issues()
    
    # Process with ML & Heuristics
    analyzed_data = detector.predict(raw_data)
    analyzed_data.sort(key=lambda x: x.get('anomaly_score', 0), reverse=True)
    
    # Calculate stats
    total_processes = len(analyzed_data)
    anomalies = sum(1 for p in analyzed_data if p.get('is_anomaly'))
    avg_score = sum(p.get('anomaly_score', 0) for p in analyzed_data) / max(1, total_processes)
    
    return {
        "timestamp": time.time(),
        "stats": {
            "total_processes": total_processes,
            "anomalies_detected": anomalies + len(system_issues),
            "system_risk_score": round(avg_score, 2),
            "integrity_issues": len(system_issues),
            "system_cpu": psutil.cpu_percent(),
            "system_memory": psutil.virtual_memory().percent
        },
        "processes": analyzed_data[:100],
        "system_issues": system_issues
    }

@app.get("/api/integrity")
def get_integrity_report():
    """Phase 2 & 7: Integrity and Persistence Report"""
    return monitor.get_system_issues()

@app.post("/api/response/terminate/{pid}")
def terminate_process(pid: int):
    """Phase 9: Automated Response"""
    try:
        p = psutil.Process(pid)
        p.terminate()
        return {"status": "success", "message": f"Process {pid} terminated."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/process/{pid}/analyze")
def analyze_process(pid: int):
    """
    Phase 1: Deep Memory Analysis
    Scans for RWX pages (Indicator of Compromise for code injection).
    """
    try:
        proc = psutil.Process(pid)
        maps = proc.memory_maps(grouped=False)
        
        rwx_regions = []
        for m in maps:
            if "r" in m.perms and "w" in m.perms and "x" in m.perms:
                rwx_regions.append({
                    "addr": m.addr,
                    "size": m.rss,
                    "path": m.path
                })
        
        return {
            "pid": pid,
            "name": proc.name(),
            "rwx_regions": rwx_regions,
            "rwx_count": len(rwx_regions),
            "is_suspicious": len(rwx_regions) > 0,
            # Phase 2 Advanced: Inline Hooks
            "integrity_scan": monitor.hook_scanner.check_inline_hooks(pid)
        }
    except (psutil.NoSuchProcess, psutil.AccessDenied) as e:
        return {"error": str(e)}

@app.post("/api/train")
def train_model(background_tasks: BackgroundTasks):
    """
    Trigger a specialized training session on current data.
    """
    data = monitor.get_latest_data()
    if len(data) < 10:
        return {"status": "error", "message": "Not enough data points to train"}
        
    detector.train(data)
    return {"status": "success", "message": "Model training started on current snapshot"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
