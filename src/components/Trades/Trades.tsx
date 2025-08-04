import { useEffect } from "react";
import { useTrades } from "../../hooks/useTrade";
import TradesTable from "../../components/TradesTable/TradesTable";
import Styles from "./Trades.module.css";

const Trades = () => {
  const { trades, loading, error, fetchTrades } = useTrades();

  useEffect(() => { fetchTrades(); }, [fetchTrades]);

  console.log(trades);

  const transformedTrades = trades?.map(trade => ({
    ...trade,
    entry_price: trade.entry_price ?? 0,
    exit_price: trade.exit_price ?? 0,
    pnl_amount: trade.pnl_amount ?? 0,
    pnl_percentage: trade.pnl_percentage ?? 0,
  })) ?? [];

  return (
    <div className={Styles.tradeContainer}>
      {loading && <div>Loading trades...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {transformedTrades.length > 0
        ? <TradesTable trades={transformedTrades} />
        : !loading && <div>No trades found.</div>
      }
    </div>
  );
};

export default Trades;