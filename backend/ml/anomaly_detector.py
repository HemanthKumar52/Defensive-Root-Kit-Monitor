import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Any

class AnomalyDetector:
    def __init__(self):
        # Isolation Forest: contamination='auto' allows the model to determine the threshold
        self.model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_columns = ['cpu_percent', 'memory_rss', 'num_threads', 'open_files_count']
        
        # Sequence Analysis (Phase 4 Upgrade)
        # pid -> deque of last 10 feature vectors
        self.sequence_history = {} 
        self.MAX_SEQ_LEN = 10

    def _extract_features(self, processes: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Extracts numerical features from the raw process list.
        """
        data = []
        for p in processes:
            # Safely get values with defaults
            row = {
                'cpu_percent': p.get('cpu_percent', 0.0) or 0.0,
                'memory_rss': p.get('memory_rss', 0),
                'num_threads': p.get('num_threads', 1),
                'open_files_count': 0 
            }
            # Simulate variance for mock if needed
            if row['memory_rss'] == 0:
                row['memory_rss'] = np.random.randint(1000, 1000000)
            
            data.append(row)
        
        df = pd.DataFrame(data)
        # Handle missing columns if any
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0
        return df[self.feature_columns]

    def train(self, processes: List[Dict[str, Any]]):
        """
        Trains the Isolation Forest model on specific features.
        """
        if not processes:
            return
            
        df = self._extract_features(processes)
        # Simple filling of NaNs
        df = df.fillna(0)
        
        X = self.scaler.fit_transform(df)
        self.model.fit(X)
        self.is_trained = True
        print("Model trained on", len(df), "samples.")

    def predict(self, processes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Returns the original process list with an added 'anomaly_score' and 'is_anomaly' field.
        """
        if not processes:
            return []
            
        # Update sequences (Phase 4)
        for p in processes:
            pid = p.get('pid')
            mem = p.get('memory_rss', 0)
            if pid:
                if pid not in self.sequence_history:
                    self.sequence_history[pid] = []
                self.sequence_history[pid].append(mem)
                if len(self.sequence_history[pid]) > self.MAX_SEQ_LEN:
                    self.sequence_history[pid].pop(0)

        # 1. Heuristic Check (Phase 1)
        # If heuristics already flagged it, we respect that.
        
        # 2. ML Check (Phase 4)
        scores = []
        predictions = []
        
        if self.is_trained:
            df = self._extract_features(processes)
            df = df.fillna(0)
            X = self.scaler.transform(df)
            
            raw_scores = self.model.decision_function(X) # lower = more abnormal
            raw_preds = self.model.predict(X) # -1 outlier
            
            # Normalize scores to 0-100
            for s in raw_scores:
                # Map -0.5...0.5 -> 100...0
                norm = max(0, min(100, (0.5 - s) * 100))
                scores.append(norm)
            
            predictions = list(raw_preds)
        else:
            scores = [0.0] * len(processes)
            predictions = [1] * len(processes)
            
        results = []
        for i, p in enumerate(processes):
            ml_score = scores[i]
            is_ml_anomaly = (predictions[i] == -1)
            
            # Combine Heuristic + ML
            heuristic_suspicious = p.get('is_suspicious', False)
            
            # Phase 4: Sequence Anomaly (Sudden Memory Spike)
            pid = p.get('pid')
            seq_anomaly = False
            if pid in self.sequence_history and len(self.sequence_history[pid]) >= 5:
                hist = self.sequence_history[pid]
                if max(hist) > 0 and (max(hist) - min(hist)) / (max(hist) + 1) > 0.5:
                     # > 50% change in memory window
                     seq_anomaly = True
            
            if heuristic_suspicious or seq_anomaly:
                # Boost score significantly
                p['anomaly_score'] = float(max(ml_score, 90.0))
                p['is_anomaly'] = True
                if seq_anomaly: p['anomalies'] = p.get('anomalies', []) + ["Behavioral: Sudden Memory Spike"]
            else:
                p['anomaly_score'] = float(round(ml_score, 2))
                p['is_anomaly'] = bool(is_ml_anomaly)
                
            results.append(p)
            
        return results
