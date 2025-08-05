import type { Trade } from "../../context/TradeContext";
import Styles from "../Calendar/Calendar.module.css";

const TradePopup = ({
  date,
  trades,
  onClose,
}: {
  date: Date,
  trades: Trade[],
  onClose: () => void
}) => {
  return (
    <div className={Styles.popupBackdrop} onClick={onClose}>
      <div className={Styles.popupBox} onClick={e => e.stopPropagation()}>
        <div className={Styles.popupHeader}>
          <span>Trades on {date.toLocaleDateString()}</span>
          <button onClick={onClose} className={Styles.popupCloseBtn}>&times;</button>
        </div>
        <div className={Styles.popupContent}>
          {trades.map(trade =>
            <div key={trade._id} className={Styles.popupTradeRow}>
              <div>
                <span className={Styles.tradeSymbol}>{trade.symbol}</span>
                <span className={Styles[trade.direction === "Long" ? "long" : "short"]}>
                  {trade.direction}
                </span>
              </div>
              <div>PnL: <b style={{color: (trade.pnl_amount ?? 0) >= 0 ? 'var(--dashboard-green-color)' : 'var(--dashboard-red-color)'}}>{trade.pnl_amount ?? "--"}</b></div>
              <div>P&L %: <b>{trade.pnl_percentage ?? "--"}%</b></div>
              <div>Entry: <b>{trade.entry_price ?? "--"}</b> | Exit: <b>{trade.exit_price ?? "--"}</b></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradePopup;
