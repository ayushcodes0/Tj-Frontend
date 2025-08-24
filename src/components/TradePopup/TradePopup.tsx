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
  const total = trades.length;
  const grossPnl = trades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0);
  const winCount = trades.filter(t => (t.pnl_amount ?? 0) > 0).length;
  const winRate = total ? (winCount / total) * 100 : 0;
  const bestTrade = trades.length
    ? trades.reduce((a, b) => ((a.pnl_amount ?? -Infinity) > (b.pnl_amount ?? -Infinity) ? a : b))
    : null;
  const worstTrade = trades.length
    ? trades.reduce((a, b) => ((a.pnl_amount ?? Infinity) < (b.pnl_amount ?? Infinity) ? a : b))
    : null;

  return (
    <div className={Styles.popupBackdrop} onClick={onClose}>
      <div className={Styles.popupBox} onClick={e => e.stopPropagation()}>
        <div className={Styles.popupHeader}>
          <span className={Styles.popupHeading}>Trades on {date.toLocaleDateString()}</span>
          <button onClick={onClose} className={Styles.popupCloseBtn}>&times;</button>
        </div>
        <div className={Styles.popupStatCards}>
          <div className={Styles.popupMiniCard}>
            <span className={Styles.popupMiniCardLabel}>Total Trades</span>
            <span className={Styles.popupMiniCardValue}>{total}</span>
          </div>
          <div className={Styles.popupMiniCard}>
            <span className={Styles.popupMiniCardLabel}>Gross P&L</span>
            <span className={grossPnl >= 0 ? Styles.popupMiniCardValueGreen : Styles.popupMiniCardValueRed}>
              {grossPnl >= 0 ? "+" : ""}
              ₹{grossPnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className={Styles.popupMiniCard}>
            <span className={Styles.popupMiniCardLabel}>Win Rate</span>
            <span className={Styles.popupMiniCardValue}>{winRate.toFixed(0)}%</span>
          </div>
          <div className={Styles.popupMiniCard}>
            <span className={Styles.popupMiniCardLabel}>Best</span>
            <span className={Styles.popupMiniCardValueGreen}>
              {bestTrade ? `₹${bestTrade.pnl_amount}` : "--"}
            </span>
          </div>
          <div className={Styles.popupMiniCard}>
            <span className={Styles.popupMiniCardLabel}>Worst</span>
            <span className={Styles.popupMiniCardValueRed}>
              {worstTrade ? `₹${worstTrade.pnl_amount}` : "--"}
            </span>
          </div>
        </div>
        <div className={Styles.popupTradeListScrollable}> {/* Changed class here */}
          {trades.map(trade => (
            <div key={trade._id} className={Styles.popupTradeCard}>
              <div className={Styles.tradeTopRow}>
                <span className={Styles.tradeSymbol}>{trade.symbol}</span>
                <span className={trade.direction === "Long"
                  ? Styles.tradeDirectionLong
                  : Styles.tradeDirectionShort}>
                  {trade.direction}
                </span>
                <span className={Styles.tradeDate}>
                  {new Date(trade.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={Styles.tradeDetailsGrid}>
                <div className={Styles.tradeDetails}>
                  <span className={Styles.detailLabel}>P&L</span>
                  <span
                    className={(trade.pnl_amount ?? 0) >= 0 ? Styles.pnlPositive : Styles.pnlNegative}
                  >
                    {typeof trade.pnl_amount === "number"
                      ? (trade.pnl_amount >= 0 ? "+" : "") + `₹${trade.pnl_amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : "--"}
                  </span>
                </div>
                <div className={Styles.tradeDetails}>
                  <span className={Styles.detailLabel}>P&L %</span>
                  <span className={(trade.pnl_amount ?? 0) >= 0 ? Styles.pnlPositive : Styles.pnlNegative}>
                    {typeof trade.pnl_percentage === "number"
                      ? (trade.pnl_percentage >= 0 ? "+" : "") + trade.pnl_percentage.toFixed(2) + "%"
                      : "--"}
                  </span>
                </div>
                <div className={Styles.tradeDetails}>
                  <span className={Styles.detailLabel}>Entry</span>
                  <span className={Styles.tradePopupInfo}>{trade.entry_price ?? "--"}</span>
                </div>
                <div className={`${Styles.tradeDetails} ${Styles.noBorder}`}>
                  <span className={Styles.detailLabel}>Exit</span>
                  <span className={Styles.tradePopupInfo}>{trade.exit_price ?? "--"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradePopup;