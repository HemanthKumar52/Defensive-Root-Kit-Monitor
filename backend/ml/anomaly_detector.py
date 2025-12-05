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

    def _extract_features(self, processes: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Extracts numerical features from the raw process list.
        """
        data = []
        for p in processes:
            # Safely get values with defaults
            row = {
                'cpu_percent': p.get('cpu_percent', 0.0) or 0.0, # psutil often returns None or 0.0 initially
                'memory_rss': p.get('memory_info', 0),
                'num_threads': p.get('num_threads', 1),
                'open_files_count': 0 # calculating this is expensive, usually skipped in fast loops
            }
            # For this mock, we'll simulate some variance if it's missing to make the plot interesting
            # In production, you'd ensure the collector gets these details.
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
            
        if not self.is_trained:
            # If not trained, just return with default safe values
            for p in processes:
                p['anomaly_score'] = 0.0
                p['is_anomaly'] = False
            return processes

        df = self._extract_features(processes)
        df = df.fillna(0)
        X = self.scaler.transform(df)
        
        # decision_function: lower is more abnormal. We invert it for a "risk score"
        # The range is roughly -0.5 to 0.5. We normalize to 0-100 roughly.
        scores = self.model.decision_function(X)
        predictions = self.model.predict(X) # -1 for outlier, 1 for inlier
        
        results = []
        for i, p in enumerate(processes):
            # Convert decision function to a simplistic 0-100 score
            # score is usually negative for anomalies.
            # Typical range: -0.5 (bad) to 0.5 (good)
            raw_score = scores[i]
            
            # Normalize: Let's map -0.5...0.5 to 100...0
            normalized_score = max(0, min(100, (0.5 - raw_score) * 100))
            
            p['anomaly_score'] = round(normalized_score, 2)
            p['is_anomaly'] = bool(predictions[i] == -1)
            results.append(p)
            
        return results
