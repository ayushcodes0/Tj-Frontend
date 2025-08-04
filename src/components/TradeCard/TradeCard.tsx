import type { Trade } from '../../context/TradeContext';
import Styles from "./TradeCard.module.css";

// Helper to safely render referenced dropdowns
function getRefName(ref?: { name?: string }) {
  return ref?.name || "—";
}

const TradeCard: React.FC<{trade: Trade}> = ({ trade }) => {
  return (
    <div className={Styles.tradeCard}>
      <div className={Styles.row}>
        <span className={Styles.symbol}>{trade.symbol}</span>
        <span>{trade.direction}</span>
        <span>{new Date(trade.date).toLocaleString()}</span>
      </div>
      <div className={Styles.row}>
        Qty: <strong>{trade.quantity}</strong>
        {trade.entry_price !== undefined && <> | Entry: {trade.entry_price}</>}
        {trade.exit_price !== undefined && <> | Exit: {trade.exit_price}</>}
        {trade.total_amount !== undefined && <> | Total: {trade.total_amount}</>}
      </div>
      <div className={Styles.row}>
        PnL: <span className={trade.pnl_amount && trade.pnl_amount >= 0 ? Styles.gain : Styles.loss}>
          {trade.pnl_amount !== undefined && trade.pnl_amount}
          {trade.pnl_percentage !== undefined && ` (${trade.pnl_percentage}%)`}
        </span>
        {trade.strategy && <> | Strategy: <b>{getRefName(trade.strategy)}</b></>}
        {trade.outcome_summary && <> | Outcome: <b>{getRefName(trade.outcome_summary)}</b></>}
      </div>
      <div className={Styles.row}>
        Tags: {trade.tags && trade.tags.length ? trade.tags.join(", ") : "None"}
      </div>
      {trade.psychology && (
        <div className={Styles.psychologyBlock}>
          <div>
            <b>Psy Score</b>: {trade.psychology.entry_confidence_level} conf., {trade.psychology.satisfaction_rating} satis.
          </div>
          <div>
            Emotions: {getRefName(trade.psychology.emotional_state)}
          </div>
          <div>
            Mistakes: {trade.psychology.mistakes_made?.join(", ") || "None"}
          </div>
          {trade.psychology.lessons_learned && (
            <div>
              <strong>Lesson: </strong>
              <span>{trade.psychology.lessons_learned}</span>
            </div>
          )}
        </div>
      )}
      {trade.trade_analysis && (
        <div className={Styles.analysisBlock}>
          <strong>Analysis:</strong>
          <div>{trade.trade_analysis}</div>
        </div>
      )}
    </div>
  );
};

export default TradeCard;
