import { createContext } from 'react';

// Mongoose-based Trade Type
export interface Psychology {
  entry_confidence_level?: number;
  satisfaction_rating?: number;
  emotional_state?: { _id: string; name: string }; // populated
  mistakes_made?: string[];
  lessons_learned?: string;
}

export interface Trade {
  _id: string;
  user_id: string;
  asset_type?: "" | "Stock" | "Option" | "Forex" | "Crypto" | "Other";
  symbol: string;
  date: string;
  quantity: number;
  total_amount?: number;
  entry_price?: number;
  exit_price?: number;
  direction: 'Long' | 'Short';
  stop_loss?: number;
  target?: number;
  strategy?: { _id: string; name: string }; // populated
  trade_analysis?: string;
  outcome_summary?: { _id: string; name: string }; // populated
  rules_followed?: { _id: string; name: string }[]; // array of refs
  pnl_amount?: number;
  pnl_percentage?: number;
  holding_period_minutes?: number;
  tags?: string[];
  psychology?: Psychology;
  createdAt?: string;
}

export interface TradeMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Updated TradeFilter to match your backend and provider
export type TradeFilter = 'lifetime' | 'week' | 'year' | 'day';

interface TradesContextType {
  trades: Trade[] | null;
  loading: boolean;
  error: string | null;
  fetchTrades: (
    filter?: TradeFilter,
    options?: { 
      year?: number; 
      week?: number;
      day?: number; 
      month?: number; 
      limit?: number; 
      page?: number; 
    }
  ) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  updateTrade: (id: string, updatedData: Partial<Trade>) => Promise<void>;
  meta: TradeMeta | null;
}

export const TradesContext = createContext<TradesContextType | undefined>(undefined);