from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from collectors.system_monitor import SystemMonitor
from ml.anomaly_detector import AnomalyDetector
import asyncio
import uvicorn
import psutil

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
monitor = SystemMonitor()
detector = AnomalyDetector()

# Global state
monitor.start()

@app.get("/api/status")
def get_status():
    return {"status": "running", "monitored_processes": len(monitor.get_latest_data())}

@app.get("/api/dashboard")
def get_dashboard_data():
    raw_data = monitor.get_latest_data()
    
    # Process with ML
    # In a real app, this should be async or cached
    analyzed_data = detector.predict(raw_data)
    
    # Sort by anomaly score descending
    analyzed_data.sort(key=lambda x: x.get('anomaly_score', 0), reverse=True)
    
    # Calculate stats
    total_processes = len(analyzed_data)
    anomalies = sum(1 for p in analyzed_data if p.get('is_anomaly'))
    
    return {
        "timestamp": 0, # Frontend can handle time
        "stats": {
            "total_processes": total_processes,
            "anomalies_detected": anomalies,
            "system_cpu": psutil.cpu_percent(),
            "system_memory": psutil.virtual_memory().percent
        },
        "processes": analyzed_data[:50] # Return top 50 suspicious/active to save bandwidth
    }

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
