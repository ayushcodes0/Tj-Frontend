import { useMemo } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./risk.module.css";

const fmtC = (num: number, d: number = 0) =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: d })
    : "--";

// Converts ratio decimal to "1:x" string. Example: 0.52 → "1:0.52", 2.25 → "1:2.25"
// function formatRatio(decimal: number | undefined | null) {
//   if (typeof decimal !== "number" || !isFinite(decimal)) return "--";
//   return `1:${decimal.toFixed(2)}`;
// }

// Converts risk:reward fractions to prettified 1:x string, rounding as you like
function prettyRiskReward(r: number) {
  if (!r || !isFinite(r)) return "--";
  // If r < 0.1, probably bad data. Show at least 1:0.1
  return `1:${Math.max(r, 0.1).toFixed(2)}`;
}

const Risk = () => {
  const { trades } = useTrades();

  const stats = useMemo(() => {
    if (!trades || !trades.length) return null;

    // Per-trade R:R calculation (using stoploss/entry/exit)
    // Risk: entry - stop_loss; Reward: abs(exit - entry)
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
          // Avoid divide by zero or ultra tiny risk (which would show huge ratios)
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

    // Risk per trade in money: abs(entry - stoploss) * quantity
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

    // % capital risked per trade (if total_amount is available)
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

    // Losses breaching max risk (risk violation)
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
        // Allow a 5% roundoff (slippage compensates)
        return trade.pnl_amount < 0 && Math.abs(trade.pnl_amount) > maxRisk * 1.05;
      }
      return false;
    });

    // R:R by symbol (show which symbols are traded with best/worst avg RR)
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
      <div className={Styles.page}>
        <div style={{ padding: 30, fontSize: 18 }}>No risk data found for this period.</div>
      </div>
    );
  }

  return (
    <div className={Styles.page}>
      <div className={Styles.grid}>
        {/* Primary R:R */}
        <div className={Styles.card}>
          <div className={Styles.cardTitle}>Average Risk:Reward</div>
          <div className={Styles.cardStatRow}>
            <span>
              <span className={Styles.cardLabel}>Average R:R:</span>
              <span className={Styles.highlightGreen}>
                {stats.avgRR !== null ? prettyRiskReward(stats.avgRR) : "--"}
              </span>
            </span>
            <span>
              <span className={Styles.cardLabel}>Median R:R:</span>
              <span className={Styles.highlightGreen}>
                {stats.medianRR !== null ? prettyRiskReward(stats.medianRR) : "--"}
              </span>
            </span>
          </div>
          <div className={Styles.cardMiniRow}>
            <span>
              <span className={Styles.cardLabel}>Best R:R:</span>
              <span className={Styles.highlightBlue}>
                {stats.bestRR ? prettyRiskReward(stats.bestRR.ratio) : "--"}
              </span>
            </span>
            <span>
              <span className={Styles.cardLabel}>Worst R:R:</span>
              <span className={Styles.highlightRed}>
                {stats.worstRR ? prettyRiskReward(stats.worstRR.ratio) : "--"}
              </span>
            </span>
            <span>
              <span className={Styles.cardLabel}>Trades Analyzed:</span>
              <span className={Styles.cardValue}>{stats.count}</span>
            </span>
          </div>
        </div>

        <div className={Styles.card}>
          <div className={Styles.cardTitle}>Risk per Trade</div>
          <div className={Styles.cardStatRow}>
            <span>
              <span className={Styles.cardLabel}>Average Risk (₹):</span>
              <span className={Styles.highlight}>{stats.avgRiskAmt !== null ? fmtC(stats.avgRiskAmt, 0) : "--"}</span>
            </span>
            <span>
              <span className={Styles.cardLabel}>Avg. Risk % Capital:</span>
              <span className={Styles.highlightBlue}>
                {stats.avgRiskPct !== null ? stats.avgRiskPct.toFixed(2) + "%" : "--"}
              </span>
            </span>
          </div>
          <div className={Styles.cardMiniRow}>
            <span>
              <span className={Styles.cardLabel}>Max Risk:</span>
              <span className={Styles.cardValue}>{stats.maxRiskAmt !== null ? fmtC(stats.maxRiskAmt, 0) : "--"}</span>
            </span>
            <span>
              <span className={Styles.cardLabel}>Min Risk:</span>
              <span className={Styles.cardValue}>{stats.minRiskAmt !== null ? fmtC(stats.minRiskAmt, 0) : "--"}</span>
            </span>
          </div>
        </div>

        <div className={Styles.card}>
          <div className={Styles.cardTitle}>Risk Discipline</div>
          <div className={Styles.cardStatRow}>
            <span>
              <span className={Styles.cardLabel}>Breached Max Risk Trades:</span>
              <span className={Styles.cardValueRed}>{stats.breachCount}</span>
            </span>
            <span>
              <span className={Styles.cardLabel}>Percent of Breaches:</span>
              <span className={Styles.cardValueRed}>{stats.breachPercent.toFixed(1)}%</span>
            </span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13.1, color: "#8b8f9b" }}>
            Breaches = trades where loss exceeded defined risk (possible slippage, poor discipline).
          </div>
        </div>

        <div className={Styles.card}>
          <div className={Styles.cardTitle}>Best R:R Symbols</div>
          <table className={Styles.simpleTable}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Avg R:R</th>
              </tr>
            </thead>
            <tbody>
              {stats.rrBySymbolSorted.length
                ? stats.rrBySymbolSorted.map(item => (
                  <tr key={item.sym}>
                    <td>{item.sym}</td>
                    <td>{item.avg !== null ? prettyRiskReward(item.avg) : "--"}</td>
                  </tr>
                ))
                : <tr><td colSpan={2}>No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Risk;
