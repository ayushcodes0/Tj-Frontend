// src/types/trade.ts

export interface TradeFormData {
  symbol: string;
  date: string;
  quantity: number | null;
  total_amount: number;
  entry_price: number | null;
  exit_price: number | null;
  direction: 'Long' | 'Short';
  stop_loss: number | null;
  target: number | null;
  strategy: string;
  trade_analysis: string;
  outcome_summary: string;
  rules_followed: string[];
  pnl_amount: number;
  pnl_percentage: number;
  holding_period_minutes: number | null;
  tags: string[];
  psychology: {
    entry_confidence_level: number;
    satisfaction_rating: number;
    emotional_state: string;
    mistakes_made: string[];
    lessons_learned: string;
  };
}

// Optional but recommended: A type for the data returned by the API after saving.
// It includes fields the database adds, like _id and timestamps.
export interface SavedTrade extends TradeFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
