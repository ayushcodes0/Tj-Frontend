import { useState, useCallback } from 'react';
import { TradesContext } from '../context/TradeContext';
import type { Trade } from '../context/TradeContext';

interface TradeMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const TradesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<TradeMeta | null>(null);

  // Fetch paginated trades
  const fetchTrades = useCallback(async (page = 1, limit = 15) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      // Adjust base URL as appropriate (e.g., /api/trades)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/trades?filter=lifetime&limit=${limit}&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch trades");
      setTrades(data.data);
      setMeta(data.meta || null);   // Assume meta is returned as described in your backend!
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setTrades(null);
      setMeta(null);
    }
    setLoading(false);
  }, []);

  return (
    <TradesContext.Provider value={{ trades, loading, error, fetchTrades, meta }}>
      {children}
    </TradesContext.Provider>
  );
};
