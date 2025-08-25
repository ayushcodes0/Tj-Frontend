import React from 'react';
import { MdEdit, MdDelete } from "react-icons/md";
import Styles from "./TradesTable.module.css";
import { useTrades } from '../../hooks/useTrade';

// Define the TradeRow interface for clarity and type-safety
export interface TradeRow {
  _id: string;
  date: string;
  symbol: string;
  direction: 'Short' | 'Long';
  entry_price: number;
  exit_price: number;
  pnl_amount: number;
  pnl_percentage: number;
  stop_loss?: number;
  target?: number;
  strategy?: { _id: string, name: string } | string;
  outcome_summary?: { _id: string, name: string } | string;
}

// Function to format milliseconds to a human-readable date
function msToDate(input: string): string {
  const d = new Date(input);
  return !isNaN(d.getTime())
    ? d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : '-';
}

// Risk/reward calculator with the requested 1:X format
function riskReward(entry: number, stop?: number, target?: number): string {
  if (stop === undefined || target === undefined) {
    return '-';
  }
  
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  
  if (risk === 0) {
    return '1:∞'; // Handle division by zero
  }

  const ratio = (reward / risk).toFixed(2);
  return `1:${ratio}`;
}

// Helper for outcome/strategy name extraction
function getName(val: undefined | null | { name?: string } | string): string {
  if (val === undefined || val === null) {
    return '-';
  }
  if (typeof val === 'string') {
    return val;
  }
  return val.name || '-';
}


const TradesTable: React.FC<{ trades: TradeRow[] }> = ({ trades }) => {
  const { deleteTrade } = useTrades();

  const handleDelete = (tradeId: string) => {
    if (window.confirm("Are you sure you want to delete this trade?")) {
      deleteTrade(tradeId);
    }
  };

  const handleEdit = (tradeId: string) => {
    alert(`Edit functionality for trade ID: ${tradeId}`);
  };

  return (
    <div className={Styles.tableWrapper}>
      <table className={Styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Symbol</th>
            <th>Direction</th>
            <th>Entry / Exit</th>
            <th>P/L (₹ / %)</th>
            <th>Risk/Reward</th>
            <th>Strategy</th>
            <th>Outcome</th>
            <th className={Styles.actions}>Actions</th>
          </tr>
        </thead> 
        <tbody>
          {trades.map(trade => (
            <tr key={trade._id}>
              <td>{msToDate(trade.date)}</td>
              <td>{trade.symbol}</td>
              <td className={Styles.direction}>{trade.direction}</td>
              <td>
                {trade.entry_price} <span className={Styles.arrow}>&rarr;</span> {trade.exit_price}
              </td>
              <td>
                <span className={trade.pnl_amount >= 0 ? Styles.green : Styles.red}>
                  ₹{trade.pnl_amount} ({trade.pnl_percentage}%)
                </span>
              </td>
              <td>{riskReward(trade.entry_price, trade.stop_loss, trade.target)}</td>
              <td>{getName(trade.strategy)}</td>
              <td>{getName(trade.outcome_summary)}</td>
              <td className={Styles.actions}>
                <div className={Styles.actionIcons}>
                  <MdEdit
                    className={Styles.editIcon}
                    onClick={() => handleEdit(trade._id)}
                  />
                  <MdDelete
                    className={Styles.deleteIcon}
                    onClick={() => handleDelete(trade._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradesTable;