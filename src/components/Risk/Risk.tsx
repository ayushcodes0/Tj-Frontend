import { useMemo } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./Risk.module.css";
import type { Trade } from "../../context/TradeContext"; // Assuming Trade type is exported from here

// Formats currency with proper symbol and localization
const fmtC = (num: number | null, d: number = 0): string =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: d })
    : "--";

// Formats Risk:Reward ratio
function prettyRiskReward(r: number | null): string {
  if (r === null || !isFinite(r)) {
    return "--";
  }
  return `1:${Math.max(r, 0).toFixed(2)}`;
}

// Direction-aware risk-reward calculation
// Direction-aware risk-reward calculation with stop_loss as distance
function calculateRiskReward(
  entry_price: number,
  stop_loss: number, // Now treating as distance, not price
  target_price: number | null,
  exit_price: number | null,
  direction: 'Long' | 'Short'
): number | null {
  // Use target if available, otherwise use exit price for reward calculation
  const reward_price = target_price !== null ? target_price : exit_price;
  
  if (reward_price === null) {
    return null;
  }

  let reward: number;

  // Updated logic: stop_loss is now distance from entry
  const risk = stop_loss; // Distance itself is the risk

  if (direction === 'Long') {
    reward = reward_price - entry_price;  // Reward is distance above entry
  } else { // Short
    reward = entry_price - reward_price;  // Reward is distance below entry
  }

  // Invalid setups return null
  if (risk <= 0 || reward <= 0) {
    return null;
  }

  return reward / risk;
}

// Direction-aware risk amount calculation with stop_loss as distance
function calculateRiskAmount(
  stop_loss: number, // Now treating as distance, not price
  quantity: number,
): number | null {
  // Since stop_loss is now distance, risk per share is simply the distance
  const risk_per_share = stop_loss;

  // Invalid setup
  if (risk_per_share <= 0) {
    return null;
  }

  return risk_per_share * quantity;
}


const Risk = () => {
  const { trades } = useTrades();

  const stats = useMemo(() => {
    if (!trades || !trades.length) return null;

    type RRStat = { ratio: number; trade: Trade };

    const rrList: RRStat[] = trades
      .map((trade: Trade) => {
        if (
          typeof trade.entry_price === "number" &&
          typeof trade.stop_loss === "number" &&
          trade.direction &&
          trade.stop_loss !== trade.entry_price
        ) {
          const ratio = calculateRiskReward(
            trade.entry_price,
            trade.stop_loss,
            trade.target || null,
            trade.exit_price || null,
            trade.direction
          );
          
          if (ratio === null || !isFinite(ratio)) {
            return undefined; // Filter out trades with invalid data
          }

          return {
            ratio,
            trade,
          };
        }
        return undefined;
      })
      .filter((rr): rr is RRStat => !!rr && isFinite(rr.ratio));

    const avgRR = rrList.length
      ? rrList.reduce((a, b) => a + b.ratio, 0) / rrList.length
      : null;

    const medianRR = (() => {
      if (!rrList.length) return null;
      const sorted = [...rrList.map(r => r.ratio)].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      if (sorted.length % 2) return sorted[mid];
      return (sorted[mid - 1] + sorted[mid]) / 2;
    })();

    const bestRR = rrList.length ? rrList.reduce((max, t) => (t.ratio > max.ratio ? t : max), rrList[0]) : null;
    const worstRR = rrList.length ? rrList.reduce((min, t) => (t.ratio < min.ratio ? t : min), rrList[0]) : null;

    const riskAmounts = trades
      .map((trade: Trade) => {
        if (
          typeof trade.entry_price === "number" &&
          typeof trade.stop_loss === "number" &&
          typeof trade.quantity === "number" &&
          trade.direction
        ) {
          return calculateRiskAmount(
            trade.stop_loss,
            trade.quantity,
          );
        }
        return null;
      })
      .filter((r): r is number => typeof r === "number" && isFinite(r));

    const avgRiskAmt = riskAmounts.length ? riskAmounts.reduce((a, b) => a + b, 0) / riskAmounts.length : null;
    const maxRiskAmt = riskAmounts.length ? Math.max(...riskAmounts) : null;
    const minRiskAmt = riskAmounts.length ? Math.min(...riskAmounts) : null;

    const riskPercents = trades
      .map((trade: Trade) => {
        if (
          typeof trade.entry_price === "number" &&
          typeof trade.stop_loss === "number" &&
          typeof trade.quantity === "number" &&
          typeof trade.total_amount === "number" &&
          trade.total_amount > 0 &&
          trade.direction
        ) {
          const amtRisk = calculateRiskAmount(
            trade.stop_loss,
            trade.quantity,
          );
          
          if (amtRisk === null) return undefined;
          
          return (amtRisk / trade.total_amount) * 100;
        }
        return undefined;
      })
      .filter((p): p is number => typeof p === "number" && isFinite(p));

    const avgRiskPct = riskPercents.length
      ? riskPercents.reduce((a, b) => a + b, 0) / riskPercents.length
      : null;

    const breaches = trades.filter((trade: Trade) => {
      if (
        typeof trade.entry_price === "number" &&
        typeof trade.stop_loss === "number" &&
        typeof trade.quantity === "number" &&
        typeof trade.pnl_amount === "number" &&
        trade.pnl_amount < 0 &&
        trade.direction
      ) {
        const maxRisk = calculateRiskAmount(
          trade.stop_loss,
          trade.quantity,
        );
        
        if (maxRisk === null || maxRisk <= 0) return false;
        
        return Math.abs(trade.pnl_amount) > maxRisk * 1.05;
      }
      return false;
    });

    const symbols = Array.from(new Set(trades.map(t => t.symbol)));
    const rrBySymbol = symbols.map(sym => {
      const relevant = rrList.filter(t => t.trade.symbol === sym);
      if (!relevant.length) return { sym, avg: null };
      return {
        sym,
        avg: relevant.reduce((a, b) => a + b.ratio, 0) / relevant.length,
      };
    }).filter(r => r.avg !== null);

    const rrBySymbolSorted = rrBySymbol
      .slice()
      .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))
      .slice(0, 5);

    return {
      avgRR,
      medianRR,
      bestRR,
      worstRR,
      count: rrList.length,
      avgRiskAmt,
      maxRiskAmt,
      minRiskAmt,
      avgRiskPct,
      breachCount: breaches.length,
      breachPercent: trades.length > 0 ? (breaches.length / trades.length) * 100 : 0,
      rrBySymbolSorted,
    };
  }, [trades]);

  if (!stats) {
    return (
      <div className={Styles.dashboard}>
        <h1 className={Styles.title}>Risk Analysis</h1>
        <div className={Styles.emptyState}>No risk data found for this period.</div>
      </div>
    );
  }

  return (
    <div className={Styles.dashboard}>
      <header className={Styles.header}>
        <h1 className={Styles.title}>Risk Analysis</h1>
        <div className={Styles.summaryCards}>
          <div className={`${Styles.summaryCard} ${Styles.primaryCard}`}>
            <div className={Styles.summaryLabel}>Average Risk:Reward Ratio</div> 
            <div className={Styles.summaryValue}>
              {stats.avgRR !== null ? prettyRiskReward(stats.avgRR) : "--"}
            </div>
          </div>
          <div className={`${Styles.summaryCard} ${stats.breachPercent > 0 ? Styles.dangerCard : Styles.successCard}`}>
            <div className={Styles.summaryLabel}>Risk Breaches</div>
            <div className={Styles.summaryValue}>{stats.breachCount}</div>
          </div>
          <div className={`${Styles.summaryCard} ${Styles.primaryCard}`} >
            <div className={Styles.summaryLabel}>Average Risk Amount</div> 
            <div className={Styles.summaryValue}>
              {stats.avgRiskAmt !== null ? fmtC(stats.avgRiskAmt, 0) : "--"}
            </div>
          </div>
        </div>
      </header>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Risk Metrics</h2>
        <div className={Styles.metricsGrid}>
          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Risk:Reward Ratio</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Risk:Reward</span> 
                  <span className={`${Styles.metricValue} ${Styles.positive}`}>
                    {stats.avgRR !== null ? prettyRiskReward(stats.avgRR) : "--"}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Median Risk:Reward</span> 
                  <span className={`${Styles.metricValue} ${Styles.positive}`}>
                    {stats.medianRR !== null ? prettyRiskReward(stats.medianRR) : "--"}
                  </span>
                </div>
              </div>
              
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Best Risk:Reward</span> 
                  <span className={Styles.metricValue}>
                    {stats.bestRR ? prettyRiskReward(stats.bestRR.ratio) : "--"}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Worst Risk:Reward</span> 
                  <span className={`${Styles.metricValue} ${Styles.negative}`}>
                    {stats.worstRR ? prettyRiskReward(stats.worstRR.ratio) : "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Risk Amounts</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Risk Amount</span> 
                  <span className={Styles.metricValue}>
                    {stats.avgRiskAmt !== null ? fmtC(stats.avgRiskAmt, 0) : "--"}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Risk Percentage</span> 
                  <span className={Styles.metricValue}>
                    {stats.avgRiskPct !== null ? stats.avgRiskPct.toFixed(2) + "%" : "--"}
                  </span>
                </div>
              </div>
              
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Maximum Risk Amount</span> 
                  <span className={Styles.metricValue}>
                    {stats.maxRiskAmt !== null ? fmtC(stats.maxRiskAmt, 0) : "--"}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Minimum Risk Amount</span> 
                  <span className={Styles.metricValue}>
                    {stats.minRiskAmt !== null ? fmtC(stats.minRiskAmt, 0) : "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Risk Discipline</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Risk Breaches Count</span> 
                  <span className={`${Styles.metricValue} ${Styles.negative}`}>
                    {stats.breachCount}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Breach Percentage</span> 
                  <span className={`${Styles.metricValue} ${Styles.negative}`}>
                    {stats.breachPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.statNote}>
                    Breaches occur when loss exceeds defined risk (possible slippage or poor discipline)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Average Risk:Reward by Symbol</h2> 
        <div className={Styles.fullWidthCard}>
          <div className={Styles.dataHeader}>
            <h3>Top Performing Symbols (Average Risk:Reward)</h3> 
          </div>
          <div className={Styles.dataBody}>
            {stats.rrBySymbolSorted.length > 0 ? (
              <table className={Styles.dataTable}>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Average Risk:Reward</th> 
                  </tr>
                </thead>
                <tbody>
                  {stats.rrBySymbolSorted.map(item => (
                    <tr key={item.sym}>
                      <td>{item.sym}</td>
                      <td>{item.avg !== null ? prettyRiskReward(item.avg) : "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={Styles.emptyState}>No symbol data available</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Risk;
