import { useContext } from 'react';
import { TradesContext } from '../context/TradeContext';

export const useTrades = () => {
  const ctx = useContext(TradesContext);
  if (!ctx) throw new Error("useTrades must be used within TradesProvider");
  return ctx;
};