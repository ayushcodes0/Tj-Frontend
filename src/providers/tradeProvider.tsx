import { useState, useCallback } from 'react';
import { TradesContext } from "../context/TradeContext";
import type { Trade, TradeMeta, TradeFilter } from '../context/TradeContext';

export type { TradeFilter };

export const TradesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<TradeMeta | null>(null);

  /**
   * Helper function to handle errors consistently.
   */
  const handleApiError = (err: unknown) => {
    if (typeof err === "object" && err && "message" in err) {
      setError((err as { message: string }).message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError("Unknown error");
    }
    setLoading(false);
    console.error("API error:", err);
  };

  /**
   * Fetches trades from the backend based on filter and options.
   */
  const fetchTrades = useCallback(
    async (
      filter: TradeFilter = 'lifetime',
      options?: { year?: number; month?: number; day?: number; week?: number; limit?: number; page?: number }
    ) => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        params.set('filter', filter);

        if (filter === 'week') {
          if (options?.year) params.set('year', String(options.year));
          if (options?.week) params.set('week', String(options.week));
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
        handleApiError(err);
        setTrades(null);
        setMeta(null);
      }
      setLoading(false);
    },
    []
  );

  /**
   * Deletes a trade by its ID.
   */
  const deleteTrade = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/trades/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to delete trade');
      }
      // Optimistically update the UI by removing the trade from the state
      setTrades(prevTrades => prevTrades?.filter(trade => trade._id !== id) || null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Updates a trade with new data.
   */
  const updateTrade = useCallback(async (id: string, updatedData: Partial<Trade>) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/trades/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update trade');
      }
      // Update the state with the new trade data
      setTrades(prevTrades =>
        prevTrades ? prevTrades.map(trade => (trade._id === id ? data.data : trade)) : null
      );
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TradesContext.Provider value={{ trades, loading, error, fetchTrades, deleteTrade, updateTrade, meta }}>
      {children}
    </TradesContext.Provider>
  );
};