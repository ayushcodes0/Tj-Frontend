import { useState, useCallback } from 'react';
import { TradesContext } from '../context/TradeContext';
import type {Trade} from '../context/TradeContext'

export const TradesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/trades?filter=lifetime`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch trades");
      setTrades(data.data); // expects API: { data: Trade[] }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setTrades(null);
    }
    setLoading(false);
  }, []);

  return (
    <TradesContext.Provider value={{ trades, loading, error, fetchTrades }}>
      {children}
    </TradesContext.Provider>
  );
};
