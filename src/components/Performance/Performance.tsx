import { useMemo } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./performance.module.css";

const fmtC = (num: number, d: number = 0) =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: d })
    : "--";

const getWinRate = (wins: number, total: number) =>
  total ? (wins / total) * 100 : 0;

const getExpectancy = (avgWin: number, winRate: number, avgLoss: number, lossRate: number) =>
  avgWin * (winRate / 100) + avgLoss * (lossRate / 100);

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Performance = () => {
  const { trades } = useTrades();

  const stats = useMemo(() => {
    if (!trades || !trades.length) return null;
    
    // --- win/loss/neutral
    const wins = trades.filter(t => (t.pnl_amount ?? 0) > 0);
    const losses = trades.filter(t => (t.pnl_amount ?? 0) < 0);
    const breakEven = trades.filter(t => (t.pnl_amount ?? 0) === 0);
    const days = Array.from(new Set(trades.map(t => t.date.slice(0, 10))));
    const byDay = Object.fromEntries(
      days.map(d => [
        d,
        trades.filter(t => t.date.slice(0, 10) === d)
      ])
    );
    const dailyWinDays = Object.values(byDay).filter(list => list.reduce((s, t) => s + (t.pnl_amount ?? 0), 0) > 0);
    const dailyLossDays = Object.values(byDay).filter(list => list.reduce((s, t) => s + (t.pnl_amount ?? 0), 0) < 0);
    const bestDay = Object.entries(byDay).reduce(
      (best, [d, list]) => {
        const pl = list.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
        return !best || pl > best.pnl
          ? { date: d, pnl: pl }
          : best;
      }, null as null | { date: string; pnl: number }
    );
    const worstDay = Object.entries(byDay).reduce(
      (best, [d, list]) => {
        const pl = list.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
        return !best || pl < best.pnl
          ? { date: d, pnl: pl }
          : best;
      }, null as null | { date: string; pnl: number }
    );

    // capital/qty
    const maxCapital = Math.max(...trades.map(t => t.total_amount ?? 0));
    const minCapital = Math.min(...trades.map(t => t.total_amount ?? 0));
    const avgCapital = trades.reduce((s, t) => s + (t.total_amount ?? 0), 0) / trades.length;
    const maxQty = Math.max(...trades.map(t => t.quantity ?? 0));
    const minQty = Math.min(...trades.map(t => t.quantity ?? 0));
    const avgQty = trades.reduce((s, t) => s + (t.quantity ?? 0), 0) / trades.length;
    const byQty = {
      [maxQty]: trades.filter(t => t.quantity === maxQty),
      [minQty]: trades.filter(t => t.quantity === minQty)
    };

    // risk: reward
    const avgRr = (() => {
      const arr = trades
        .map(t =>
          t.stop_loss && t.entry_price
            ? Math.abs((t.exit_price ?? t.entry_price) - t.entry_price) /
              Math.abs((t.entry_price - t.stop_loss) || 1)
            : undefined
        )
        .filter(x => typeof x === "number" && isFinite(x)) as number[];
      if (!arr.length) return 0;
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    })();

    // Setup Effectiveness
    const strategies = Array.from(
      new Set(trades.map(t => t.strategy?.name).filter(Boolean))
    );
    const setupStats = strategies.map(name => {
      const ts = trades.filter(t => t.strategy?.name === name);
      const wins = ts.filter(t => (t.pnl_amount ?? 0) > 0).length;
      return { name, winRate: getWinRate(wins, ts.length), count: ts.length };
    });

    // Symbol frequency/stats
    const symbols = Array.from(new Set(trades.map(t => t.symbol)));
    const symbolStatArr = symbols.map(sym => {
      const ts = trades.filter(t => t.symbol === sym);
      const winCount = ts.filter(t => (t.pnl_amount ?? 0) > 0).length;
      const winRate = getWinRate(winCount, ts.length);
      const profit = ts.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
      return { sym, count: ts.length, profit, winRate };
    });
    const mostTraded = symbolStatArr.reduce((a, b) => a.count > b.count ? a : b, symbolStatArr[0]);
    const mostProf = symbolStatArr.reduce((a, b) => a.profit > b.profit ? a : b, symbolStatArr[0]);
    const leastProf = symbolStatArr.reduce((a, b) => a.profit < b.profit ? a : b, symbolStatArr[0]);
    const highestWinr = symbolStatArr.reduce((a, b) => a.winRate > b.winRate ? a : b, symbolStatArr[0]);
    const lowestWinr = symbolStatArr.reduce((a, b) => a.winRate < b.winRate ? a : b, symbolStatArr[0]);

    // Consecutive wins/losses
    let consecWins = 0, maxConsecWins = 0, consecLosses = 0, maxConsecLosses = 0;
    for (const t of trades) {
      if ((t.pnl_amount ?? 0) > 0) {
        consecWins++;
        maxConsecWins = Math.max(maxConsecWins, consecWins);
        consecLosses = 0;
      } else if ((t.pnl_amount ?? 0) < 0) {
        consecLosses++;
        maxConsecLosses = Math.max(maxConsecLosses, consecLosses);
        consecWins = 0;
      } else {
        consecWins = 0;
        consecLosses = 0;
      }
    }
    
    // Win/Loss streak days by day
    let maxConsecWinDays = 0, maxConsecLossDays = 0, lastDayWin = false, streak = 0;
    const sortedDays = Object.keys(byDay).sort();
    for (const d of sortedDays) {
      const pnl = byDay[d].reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0);
      if (pnl > 0) {
        streak = lastDayWin ? streak + 1 : 1;
        maxConsecWinDays = Math.max(maxConsecWinDays, streak);
        lastDayWin = true;
      } else if (pnl < 0) {
        streak = !lastDayWin ? streak + 1 : 1;
        maxConsecLossDays = Math.max(maxConsecLossDays, streak);
        lastDayWin = false;
      } else {
        streak = 0;
        lastDayWin = false;
      }
    }

    // Weekday stats
    const tradesByWeekday: Record<string, typeof trades> = {};
    trades.forEach(t => {
      const wd = weekdays[new Date(t.date).getDay()];
      tradesByWeekday[wd] = tradesByWeekday[wd] || [];
      tradesByWeekday[wd].push(t);
    });

    const weekdayData = weekdays.map(day => {
      const ts = tradesByWeekday[day] ?? [];
      const pnl = ts.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0);
      const win = ts.filter(t => (t.pnl_amount ?? 0) > 0).length;
      const rrArr = ts.map(t =>
        t.stop_loss && t.entry_price
          ? Math.abs((t.exit_price ?? t.entry_price) - t.entry_price) /
            Math.abs((t.entry_price - t.stop_loss) || 1)
          : undefined
      ).filter(x => typeof x === "number" && isFinite(x)) as number[];
      const avgRr = rrArr.length ? (rrArr.reduce((a, b) => a + b, 0) / rrArr.length) : null;
      return {
        day,
        trades: ts.length,
        pnl,
        winRate: getWinRate(win, ts.length),
        avgRr
      };
    });

    // Daily trade activity
    const tradesPerDay = Object.values(byDay).map(tl => tl.length);
    const avgTradesPerDay = tradesPerDay.length ? tradesPerDay.reduce((a, b) => a + b, 0) / tradesPerDay.length : 0;
    const maxTradesDay = tradesPerDay.length ? Math.max(...tradesPerDay) : 0;
    const singleTradeDays = tradesPerDay.filter(n => n === 1).length;
    const overtradingDays = tradesPerDay.filter(n => n > 7).length;

    // Main stats
    const total = trades.length;
    const avgWin = wins.length ? wins.reduce((s, t) => s + (t.pnl_amount ?? 0), 0) / wins.length : 0;
    const avgLoss = losses.length ? losses.reduce((s, t) => s + (t.pnl_amount ?? 0), 0) / losses.length : 0;
    const winRate = getWinRate(wins.length, total);
    const lossRate = total ? (losses.length / total) * 100 : 0;
    const expectancy = getExpectancy(avgWin, winRate, avgLoss, lossRate);

    // Most profitable strategy
    const stratProfits: Record<string, number> = {};
    trades.forEach(t => {
      if (t.strategy?.name)
        stratProfits[t.strategy.name] = (stratProfits[t.strategy.name] ?? 0) + (t.pnl_amount ?? 0);
    });
    const mostProfStratName = Object.entries(stratProfits).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    return {
      total,
      wins: wins.length,
      losses: losses.length,
      breakEven: breakEven.length,
      avgWin,
      avgLoss,
      winRate,
      expectancy,
      dailyWinDays: dailyWinDays.length,
      dailyLossDays: dailyLossDays.length,
      bestDay,
      worstDay,
      maxCapital, minCapital, avgCapital,
      maxQty, minQty, avgQty,
      capitalPnlAtMax: trades.filter(t => t.total_amount === maxCapital).reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0),
      capitalPnlAtMin: trades.filter(t => t.total_amount === minCapital).reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0),
      qtyPnlAtMax: byQty[maxQty].reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0),
      qtyPnlAtMin: byQty[minQty].reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0),
      avgRr,
      setupStats,
      strategies,
      symbolStatArr,
      mostTraded,
      mostProf,
      leastProf,
      highestWinr,
      lowestWinr,
      maxConsecWins,
      maxConsecLosses,
      maxConsecWinDays,
      maxConsecLossDays,
      tradesByWeekday,
      weekdayData,
      avgTradesPerDay,
      maxTradesDay,
      singleTradeDays,
      overtradingDays,
      mostProfStratName
    };
  }, [trades]);

  if (!stats) {
    return <div className={Styles.noTrades}>No trades found for this period.</div>;
  }

  return (
    <div className={Styles.performancePage}>
      <h1 className={Styles.pageTitle}>Trading Performance Analytics</h1>
      
      {/* Overview Section */}
      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Overview</h2>
        <div className={Styles.cardGrid}>
          <div className={`${Styles.card} ${Styles.highlightCard}`}>
            <div className={Styles.cardHeader}>
              <h3>Trade Summary</h3>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Total Trades</span>
                  <span className={Styles.statValue}>{stats.total}</span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Win Rate</span>
                  <span className={`${Styles.statValue} ${stats.winRate >= 50 ? Styles.positive : Styles.negative}`}>
                    {stats.winRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Winning Trades</span>
                  <span className={`${Styles.statValue} ${Styles.positive}`}>{stats.wins}</span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Losing Trades</span>
                  <span className={`${Styles.statValue} ${Styles.negative}`}>{stats.losses}</span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Avg. Win</span>
                  <span className={`${Styles.statValue} ${Styles.positive}`}>{fmtC(stats.avgWin, 2)}</span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Avg. Loss</span>
                  <span className={`${Styles.statValue} ${Styles.negative}`}>{fmtC(stats.avgLoss, 2)}</span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Expectancy</span>
                  <span className={`${Styles.statValue} ${stats.expectancy >= 0 ? Styles.positive : Styles.negative}`}>
                    {fmtC(stats.expectancy, 2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Updated Daily Performance Card in the component */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Daily Performance</h3>
          </div>
          <div className={Styles.cardBody}>
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Win Days</span>
                <span className={`${Styles.statValue} ${Styles.positive}`}>{stats.dailyWinDays}</span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Loss Days</span>
                <span className={`${Styles.statValue} ${Styles.negative}`}>{stats.dailyLossDays}</span>
              </div>
            </div>
            
            {/* Updated Best/Worst Day Display */}
            <div className={Styles.dayPerformance}>
              <div className={Styles.dayPerformanceItem}>
                <span className={Styles.dayPerformanceLabel}>Best Day</span>
                {stats.bestDay ? (
                  <>
                    <span className={Styles.dayPerformanceDate}>{new Date(stats.bestDay.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span className={`${Styles.dayPerformanceValue} ${Styles.positive}`}>{fmtC(stats.bestDay.pnl)}</span>
                  </>
                ) : (
                  <span className={Styles.dayPerformanceEmpty}>--</span>
                )}
              </div>
              <div className={Styles.dayPerformanceItem}>
                <span className={Styles.dayPerformanceLabel}>Worst Day</span>
                {stats.worstDay ? (
                  <>
                    <span className={Styles.dayPerformanceDate}>{new Date(stats.worstDay.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span className={`${Styles.dayPerformanceValue} ${Styles.negative}`}>{fmtC(stats.worstDay.pnl)}</span>
                  </>
                ) : (
                  <span className={Styles.dayPerformanceEmpty}>--</span>
                )}
              </div>
            </div>
            
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Max Consec. Win Days</span>
                <span className={`${Styles.statValue} ${Styles.positive}`}>{stats.maxConsecWinDays}</span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Max Consec. Loss Days</span>
                <span className={`${Styles.statValue} ${Styles.negative}`}>{stats.maxConsecLossDays}</span>
              </div>
            </div>
          </div>
        </div>

          <div className={Styles.card}>
            <div className={Styles.cardHeader}>
              <h3>Streaks & Activity</h3>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Max Consec. Wins</span>
                  <span className={`${Styles.statValue} ${Styles.positive}`}>{stats.maxConsecWins}</span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Max Consec. Losses</span>
                  <span className={`${Styles.statValue} ${Styles.negative}`}>{stats.maxConsecLosses}</span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Avg. Trades/Day</span>
                  <span className={Styles.statValue}>{stats.avgTradesPerDay.toFixed(1)}</span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Max Trades/Day</span>
                  <span className={Styles.statValue}>{stats.maxTradesDay}</span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Single Trade Days</span>
                  <span className={Styles.statValue}>{stats.singleTradeDays}</span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Overtrading Days</span>
                  <span className={Styles.statValue}>{stats.overtradingDays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capital & Quantity Section */}
      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Capital & Quantity Analysis</h2>
        <div className={Styles.cardGrid}>
          <div className={Styles.card}>
            <div className={Styles.cardHeader}>
              <h3>Capital Usage</h3>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Max Capital</span>
                  <span className={Styles.statValue}>{fmtC(stats.maxCapital)}</span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Min Capital</span>
                  <span className={Styles.statValue}>{fmtC(stats.minCapital)}</span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Avg Capital</span>
                  <span className={Styles.statValue}>{fmtC(stats.avgCapital)}</span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>P&L @ Max Capital</span>
                  <span className={`${Styles.statValue} ${stats.capitalPnlAtMax >= 0 ? Styles.positive : Styles.negative}`}>
                    {fmtC(stats.capitalPnlAtMax)}
                  </span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>P&L @ Min Capital</span>
                  <span className={`${Styles.statValue} ${stats.capitalPnlAtMin >= 0 ? Styles.positive : Styles.negative}`}>
                    {fmtC(stats.capitalPnlAtMin)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.card}>
            <div className={Styles.cardHeader}>
              <h3>Quantity Analysis</h3>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Max Quantity</span>
                  <span className={Styles.statValue}>{stats.maxQty}</span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Min Quantity</span>
                  <span className={Styles.statValue}>{stats.minQty}</span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Avg Quantity</span>
                  <span className={Styles.statValue}>{stats.avgQty.toFixed(1)}</span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>P&L @ Max Qty</span>
                  <span className={`${Styles.statValue} ${stats.qtyPnlAtMax >= 0 ? Styles.positive : Styles.negative}`}>
                    {fmtC(stats.qtyPnlAtMax)}
                  </span>
                </div>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>P&L @ Min Qty</span>
                  <span className={`${Styles.statValue} ${stats.qtyPnlAtMin >= 0 ? Styles.positive : Styles.negative}`}>
                    {fmtC(stats.qtyPnlAtMin)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.card}>
            <div className={Styles.cardHeader}>
              <h3>Risk Metrics</h3>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Avg. Risk:Reward</span>
                  <span className={Styles.statValue}>{stats.avgRr.toFixed(2)}</span>
                </div>
              </div>
              <div className={Styles.statRow}>
                <div className={Styles.statItem}>
                  <span className={Styles.statLabel}>Most Profitable Strategy</span>
                  <span className={`${Styles.statValue} ${Styles.positive}`}>{stats.mostProfStratName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Symbols & Strategies Section */}
      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Symbols & Strategies</h2>
        <div className={Styles.cardGrid}>
          {/* Symbol Performance Table */}
          <div className={`${Styles.card} ${Styles.tableCard}`}>
            <div className={Styles.cardHeader}>
              <h3>Symbol Performance</h3>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.tableContainer}>
                <table className={Styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Symbol</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Most Traded</td>
                      <td>{stats.mostTraded?.sym}</td>
                      <td>{stats.mostTraded?.count} trades</td>
                    </tr>
                    <tr>
                      <td>Most Profitable</td>
                      <td>{stats.mostProf?.sym}</td>
                      <td className={Styles.positive}>{fmtC(stats.mostProf?.profit)}</td>
                    </tr>
                    <tr>
                      <td>Least Profitable</td>
                      <td>{stats.leastProf?.sym}</td>
                      <td className={Styles.negative}>{fmtC(stats.leastProf?.profit)}</td>
                    </tr>
                    <tr>
                      <td>Highest Win Rate</td>
                      <td>{stats.highestWinr?.sym}</td>
                      <td className={Styles.positive}>{stats.highestWinr?.winRate.toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td>Lowest Win Rate</td>
                      <td>{stats.lowestWinr?.sym}</td>
                      <td className={Styles.negative}>{stats.lowestWinr?.winRate.toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Strategy Effectiveness Table */}
          <div className={`${Styles.card} ${Styles.tableCard}`}>
            <div className={Styles.cardHeader}>
              <h3>Strategy Effectiveness</h3>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.tableContainer}>
                <table className={Styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Strategy</th>
                      <th>Win Rate</th>
                      <th>Trades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.setupStats.map(({ name, winRate, count }) => (
                      <tr key={name}>
                        <td>{name}</td>
                        <td className={winRate >= 50 ? Styles.positive : Styles.negative}>
                          {winRate.toFixed(1)}%
                        </td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Weekday Analysis Table - Already wrapped */}
          <div className={`${Styles.card} ${Styles.tableCard} ${Styles.wideCard}`}>
            <div className={Styles.cardHeader}>
              <h3>Performance by Weekday</h3>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.tableContainer}>
                <table className={Styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Trades</th>
                      <th>P&L</th>
                      <th>Win Rate</th>
                      <th>Avg. R:R</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.weekdayData.map(d => (
                      <tr key={d.day}>
                        <td>{d.day}</td>
                        <td>{d.trades}</td>
                        <td className={d.pnl >= 0 ? Styles.positive : Styles.negative}>
                          {fmtC(d.pnl)}
                        </td>
                        <td className={d.winRate >= 50 ? Styles.positive : Styles.negative}>
                          {d.winRate ? d.winRate.toFixed(1) + "%" : "--"}
                        </td>
                        <td>{d.avgRr ? d.avgRr.toFixed(2) : "--"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Weekday Analysis Section */}
      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Weekday Analysis</h2>
        <div className={Styles.cardGrid}>
          <div className={`${Styles.card} ${Styles.tableCard} ${Styles.wideCard}`}>
            <div className={Styles.cardHeader}>
              <h3>Performance by Weekday</h3>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.tableContainer}>
                <table className={Styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Trades</th>
                      <th>P&L</th>
                      <th>Win Rate</th>
                      <th>Avg. R:R</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.weekdayData.map(d => (
                      <tr key={d.day}>
                        <td>{d.day}</td>
                        <td>{d.trades}</td>
                        <td className={d.pnl >= 0 ? Styles.positive : Styles.negative}>
                          {fmtC(d.pnl)}
                        </td>
                        <td className={d.winRate >= 50 ? Styles.positive : Styles.negative}>
                          {d.winRate ? d.winRate.toFixed(1) + "%" : "--"}
                        </td>
                        <td>{d.avgRr ? d.avgRr.toFixed(2) : "--"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Performance;