import Styles from "./Trades.module.css";
import { useEffect } from "react";
import { useTrades } from "../../hooks/useTrade";
import TradeCard from "../../components/TradeCard/TradeCard";

const Trades = () => {
  const { trades, loading, error, fetchTrades } = useTrades();

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return (
    <div className={Styles.tradeContainer}>
      {loading && <div>Loading trades...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className={Styles.trades}>
        {trades && trades.length > 0
          ? trades.map(trade => (
              <TradeCard key={trade._id} trade={trade} />
            ))
          : !loading && <div>No trades found.</div>
        }
      </div>
    </div>
  );
};

export default Trades;
