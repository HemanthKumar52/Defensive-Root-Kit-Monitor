import { useState, useEffect } from 'react';

const API_Base = "http://localhost:8000/api";

export function useMonitor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_Base}/dashboard`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  const trainModel = async () => {
    try {
      await fetch(`${API_Base}/train`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  return { data, loading, error, trainModel };
}
