export type StringOrObject = string | { _id: string; name: string };

export interface TradeFormData {
  symbol: string;
  date: string;
  quantity: number | null;
  total_amount: number;
  asset_type?: "" | "Stock" | "Option" | "Forex" | "Crypto" | "Other";
  entry_price: number | null;
  exit_price: number | null;
  direction: "Long" | "Short";
  stop_loss: number | null;
  target: number | null;

  // 🔥 FIXED THESE 3 FIELDS
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

export interface SavedTrade extends TradeFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
