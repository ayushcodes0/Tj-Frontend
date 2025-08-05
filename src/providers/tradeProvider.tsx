import { useState, useCallback } from 'react';
import { TradesContext } from '../context/TradeContext';
import type { Trade, TradeMeta } from '../context/TradeContext';

export type TradeFilter = 'lifetime' | 'month' | 'year' | 'day';

export const TradesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<TradeMeta | null>(null);

  /**
   * filter: 'lifetime' | 'month' | 'year' | 'day'
   * options: for 'month', supply year/month; for 'year', supply year; for 'day', supply year/month/day
   * page & limit for paginated tables
   */
  const fetchTrades = useCallback(
    async (
      filter: TradeFilter = 'lifetime',
      options?: { year?: number; month?: number; day?: number; limit?: number; page?: number }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        params.set('filter', filter);

        // Add correct params for each filter type
        if (filter === 'month') {
          if (options?.year) params.set('year', String(options.year));
          if (options?.month) params.set('month', String(options.month));
        }
        if (filter === 'year') {
          if (options?.year) params.set('year', String(options.year));
        }
        if (filter === 'day') {
          if (options?.year) params.set('year', String(options.year));
          if (options?.month) params.set('month', String(options.month));
          if (options?.day) params.set('day', String(options.day));
        }

        params.set('limit', String(options?.limit || 1000));
        params.set('page', String(options?.page || 1));

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/trades?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to fetch trades');
        setTrades(data.data);
        setMeta(data.meta || null);
      } catch (err) {
        // TypeScript-safe error handling without "any"
        if (typeof err === "object" && err && "message" in err) {
          setError((err as { message: string }).message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("Unknown error");
        }
        setTrades(null);
        setMeta(null);
      }
      setLoading(false);
    },
    []
  );

  return (
    <TradesContext.Provider value={{ trades, loading, error, fetchTrades, meta }}>
      {children}
    </TradesContext.Provider>
  );
};
