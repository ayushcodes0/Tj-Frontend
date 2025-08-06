import { useMemo } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./risk.module.css";

const fmtC = (num: number, d: number = 0) =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: d })
    : "--";

function prettyRiskReward(r: number) {
  if (!r || !isFinite(r)) return "--";
  return `1:${Math.max(r, 0.1).toFixed(2)}`;
}

const Risk = () => {
  const { trades } = useTrades();

  const stats = useMemo(() => {
    if (!trades || !trades.length) return null;

    type RRStat = { ratio: number; label: string; trade: typeof trades[number] };
    const rrList: RRStat[] = trades
      .map(trade => {
        if (
          typeof trade.entry_price === "number" &&
          typeof trade.stop_loss === "number" &&
          trade.stop_loss !== trade.entry_price
        ) {
          const risk = Math.abs(trade.entry_price - trade.stop_loss);
          const reward = Math.abs((trade.exit_price ?? trade.entry_price) - trade.entry_price);
          if (!risk || !isFinite(risk) || reward < 0) return undefined;
          return {
            ratio: reward / risk,
            label: `1:${(reward / risk).toFixed(2)}`,
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

    const bestRR = rrList.reduce((max, t) => (t.ratio > max.ratio ? t : max), rrList[0]);
    const worstRR = rrList.reduce((min, t) => (t.ratio < min.ratio ? t : min), rrList[0]);

    const riskAmounts = trades
      .map(trade =>
        typeof trade.entry_price === "number" && typeof trade.stop_loss === "number" && typeof trade.quantity === "number"
          ? Math.abs(trade.entry_price - trade.stop_loss) * trade.quantity
          : null
      )
      .filter((r): r is number => typeof r === "number" && isFinite(r));
    const avgRiskAmt = riskAmounts.length ? riskAmounts.reduce((a, b) => a + b, 0) / riskAmounts.length : null;
    const maxRiskAmt = riskAmounts.length ? Math.max(...riskAmounts) : null;
    const minRiskAmt = riskAmounts.length ? Math.min(...riskAmounts) : null;

    const riskPercents = trades
      .map(trade => {
        if (
          typeof trade.entry_price === "number" &&
          typeof trade.stop_loss === "number" &&
          typeof trade.quantity === "number" &&
          typeof trade.total_amount === "number" &&
          trade.total_amount > 0
        ) {
          const amtRisk = Math.abs(trade.entry_price - trade.stop_loss) * trade.quantity;
          return (amtRisk / trade.total_amount) * 100;
        }
        return undefined;
      })
      .filter((p): p is number => typeof p === "number" && isFinite(p));
    const avgRiskPct = riskPercents.length
      ? riskPercents.reduce((a, b) => a + b, 0) / riskPercents.length
      : null;

    const breaches = trades.filter(trade => {
      if (
        typeof trade.entry_price === "number" &&
        typeof trade.stop_loss === "number" &&
        typeof trade.quantity === "number" &&
        typeof trade.total_amount === "number" &&
        typeof trade.pnl_amount === "number" &&
        trade.total_amount > 0
      ) {
        const maxRisk = Math.abs(trade.entry_price - trade.stop_loss) * trade.quantity;
        return trade.pnl_amount < 0 && Math.abs(trade.pnl_amount) > maxRisk * 1.05;
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
      breachPercent: trades.length ? (breaches.length / trades.length) * 100 : 0,
      rrBySymbolSorted,
    };
  }, [trades]);

  if (!stats) {
    return (
      <div className={Styles.performancePage}>
        <h1 className={Styles.pageTitle}>Risk Analysis</h1>
        <div className={Styles.emptyState}>No risk data found for this period.</div>
      </div>
    );
  }

  return (
    <div className={Styles.performancePage}>
      <h1 className={Styles.pageTitle}>Risk Analysis</h1>
      
      <div className={Styles.cardGrid}>
        {/* Risk:Reward Card */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Risk:Reward Ratio</h3>
          </div>
          <div className={Styles.cardBody}>
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Average R:R</span>
                <span className={`${Styles.statValue} ${Styles.positive}`}>
                  {stats.avgRR !== null ? prettyRiskReward(stats.avgRR) : "--"}
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Median R:R</span>
                <span className={`${Styles.statValue} ${Styles.positive}`}>
                  {stats.medianRR !== null ? prettyRiskReward(stats.medianRR) : "--"}
                </span>
              </div>
            </div>
            
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Best R:R</span>
                <span className={Styles.statValue}>
                  {stats.bestRR ? prettyRiskReward(stats.bestRR.ratio) : "--"}
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Worst R:R</span>
                <span className={`${Styles.statValue} ${Styles.negative}`}>
                  {stats.worstRR ? prettyRiskReward(stats.worstRR.ratio) : "--"}
                </span>
              </div>
            </div>
            
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Trades Analyzed</span>
                <span className={Styles.statValue}>{stats.count}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Amounts Card */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Risk per Trade</h3>
          </div>
          <div className={Styles.cardBody}>
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Avg Risk Amount</span>
                <span className={Styles.statValue}>
                  {stats.avgRiskAmt !== null ? fmtC(stats.avgRiskAmt, 0) : "--"}
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Avg Risk %</span>
                <span className={Styles.statValue}>
                  {stats.avgRiskPct !== null ? stats.avgRiskPct.toFixed(2) + "%" : "--"}
                </span>
              </div>
            </div>
            
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Max Risk</span>
                <span className={Styles.statValue}>
                  {stats.maxRiskAmt !== null ? fmtC(stats.maxRiskAmt, 0) : "--"}
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Min Risk</span>
                <span className={Styles.statValue}>
                  {stats.minRiskAmt !== null ? fmtC(stats.minRiskAmt, 0) : "--"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Discipline Card */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Risk Discipline</h3>
          </div>
          <div className={Styles.cardBody}>
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Risk Breaches</span>
                <span className={`${Styles.statValue} ${Styles.negative}`}>
                  {stats.breachCount}
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Breach %</span>
                <span className={`${Styles.statValue} ${Styles.negative}`}>
                  {stats.breachPercent.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statNote}>
                  Breaches occur when loss exceeds defined risk (possible slippage or poor discipline)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Best R:R Symbols Card */}
        <div className={`${Styles.card} ${Styles.wideCard}`}>
          <div className={Styles.cardHeader}>
            <h3>Best Risk:Reward by Symbol</h3>
          </div>
          <div className={Styles.cardBody}>
            {stats.rrBySymbolSorted.length > 0 ? (
              <div className={Styles.tableContainer}>
                <table className={Styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Average R:R</th>
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
              </div>
            ) : (
              <div className={Styles.emptyState}>No symbol data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Risk;