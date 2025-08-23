import { useMemo } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./Performance.module.css";

const formatCurrency = (num: number, decimals: number = 0) =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: decimals })
    : "--";

const calculateWinRate = (wins: number, total: number) =>
  total ? (wins / total) * 100 : 0;

const calculateExpectancy = (averageWin: number, winRate: number, averageLoss: number, lossRate: number) =>
  averageWin * (winRate / 100) + averageLoss * (lossRate / 100);

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Performance = () => {
  const { trades } = useTrades();

  const stats = useMemo(() => {
    if (!trades || !trades.length) return null;
    
    const wins = trades.filter(trade => (trade.pnl_amount ?? 0) > 0);
    const losses = trades.filter(trade => (trade.pnl_amount ?? 0) < 0);
    const breakEven = trades.filter(trade => (trade.pnl_amount ?? 0) === 0);
    const days = Array.from(new Set(trades.map(trade => trade.date.slice(0, 10))));
    const byDay = Object.fromEntries(
      days.map(day => [
        day,
        trades.filter(trade => trade.date.slice(0, 10) === day)
      ])
    );
    const dailyWinDays = Object.values(byDay).filter(list => list.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0) > 0);
    const dailyLossDays = Object.values(byDay).filter(list => list.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0) < 0);
    const bestDay = Object.entries(byDay).reduce(
      (best, [date, list]) => {
        const profitLoss = list.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
        return !best || profitLoss > best.profitLoss
          ? { date, profitLoss }
          : best;
      }, null as null | { date: string; profitLoss: number }
    );
    const worstDay = Object.entries(byDay).reduce(
      (best, [date, list]) => {
        const profitLoss = list.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
        return !best || profitLoss < best.profitLoss
          ? { date, profitLoss }
          : best;
      }, null as null | { date: string; profitLoss: number }
    );

    const maximumCapital = Math.max(...trades.map(trade => trade.total_amount ?? 0));
    const minimumCapital = Math.min(...trades.map(trade => trade.total_amount ?? 0));
    const averageCapital = trades.reduce((sum, trade) => sum + (trade.total_amount ?? 0), 0) / trades.length;
    const maximumQuantity = Math.max(...trades.map(trade => trade.quantity ?? 0));
    const minimumQuantity = Math.min(...trades.map(trade => trade.quantity ?? 0));
    const averageQuantity = trades.reduce((sum, trade) => sum + (trade.quantity ?? 0), 0) / trades.length;
    const byQuantity = {
      [maximumQuantity]: trades.filter(trade => trade.quantity === maximumQuantity),
      [minimumQuantity]: trades.filter(trade => trade.quantity === minimumQuantity)
    };

    const averageRiskReward = (() => {
      const arr = trades
        .map(trade =>
          trade.stop_loss && trade.entry_price
            ? Math.abs((trade.exit_price ?? trade.entry_price) - trade.entry_price) /
              Math.abs((trade.entry_price - trade.stop_loss) || 1)
            : undefined
        )
        .filter(value => typeof value === "number" && isFinite(value)) as number[];
      if (!arr.length) return 0;
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    })();

    const strategies = Array.from(
      new Set(trades.map(trade => trade.strategy?.name).filter(Boolean))
    );
    const setupStats = strategies.map(name => {
      const tradesByStrategy = trades.filter(trade => trade.strategy?.name === name);
      const wins = tradesByStrategy.filter(trade => (trade.pnl_amount ?? 0) > 0).length;
      return { name, winRate: calculateWinRate(wins, tradesByStrategy.length), count: tradesByStrategy.length };
    });

    const symbols = Array.from(new Set(trades.map(trade => trade.symbol)));
    const symbolStatistics = symbols.map(symbol => {
      const tradesBySymbol = trades.filter(trade => trade.symbol === symbol);
      const winCount = tradesBySymbol.filter(trade => (trade.pnl_amount ?? 0) > 0).length;
      const winRate = calculateWinRate(winCount, tradesBySymbol.length);
      const profit = tradesBySymbol.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
      return { symbol, count: tradesBySymbol.length, profit, winRate };
    });
    const mostTraded = symbolStatistics.reduce((a, b) => a.count > b.count ? a : b, symbolStatistics[0]);
    const mostProfitable = symbolStatistics.reduce((a, b) => a.profit > b.profit ? a : b, symbolStatistics[0]);
    const leastProfitable = symbolStatistics.reduce((a, b) => a.profit < b.profit ? a : b, symbolStatistics[0]);
    const highestWinRate = symbolStatistics.reduce((a, b) => a.winRate > b.winRate ? a : b, symbolStatistics[0]);
    const lowestWinRate = symbolStatistics.reduce((a, b) => a.winRate < b.winRate ? a : b, symbolStatistics[0]);

    let consecutiveWins = 0, maximumConsecutiveWins = 0, consecutiveLosses = 0, maximumConsecutiveLosses = 0;
    for (const trade of trades) {
      if ((trade.pnl_amount ?? 0) > 0) {
        consecutiveWins++;
        maximumConsecutiveWins = Math.max(maximumConsecutiveWins, consecutiveWins);
        consecutiveLosses = 0;
      } else if ((trade.pnl_amount ?? 0) < 0) {
        consecutiveLosses++;
        maximumConsecutiveLosses = Math.max(maximumConsecutiveLosses, consecutiveLosses);
        consecutiveWins = 0;
      } else {
        consecutiveWins = 0;
        consecutiveLosses = 0;
      }
    }
    
    let maximumConsecutiveWinDays = 0, maximumConsecutiveLossDays = 0, lastDayWin = false, streak = 0;
    const sortedDays = Object.keys(byDay).sort();
    for (const day of sortedDays) {
      const profitLoss = byDay[day].reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
      if (profitLoss > 0) {
        streak = lastDayWin ? streak + 1 : 1;
        maximumConsecutiveWinDays = Math.max(maximumConsecutiveWinDays, streak);
        lastDayWin = true;
      } else if (profitLoss < 0) {
        streak = !lastDayWin ? streak + 1 : 1;
        maximumConsecutiveLossDays = Math.max(maximumConsecutiveLossDays, streak);
        lastDayWin = false;
      } else {
        streak = 0;
        lastDayWin = false;
      }
    }

    const tradesByWeekday: Record<string, typeof trades> = {};
    trades.forEach(trade => {
      const weekday = weekdays[new Date(trade.date).getDay()];
      tradesByWeekday[weekday] = tradesByWeekday[weekday] || [];
      tradesByWeekday[weekday].push(trade);
    });

    const weekdayData = weekdays.map(day => {
      const tradesByDay = tradesByWeekday[day] ?? [];
      const profitLoss = tradesByDay.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
      const wins = tradesByDay.filter(trade => (trade.pnl_amount ?? 0) > 0).length;
      const riskRewardArray = tradesByDay.map(trade =>
        trade.stop_loss && trade.entry_price
          ? Math.abs((trade.exit_price ?? trade.entry_price) - trade.entry_price) /
            Math.abs((trade.entry_price - trade.stop_loss) || 1)
          : undefined
      ).filter(value => typeof value === "number" && isFinite(value)) as number[];
      const averageRiskReward = riskRewardArray.length ? (riskRewardArray.reduce((a, b) => a + b, 0) / riskRewardArray.length) : null;
      return {
        day,
        trades: tradesByDay.length,
        profitLoss,
        winRate: calculateWinRate(wins, tradesByDay.length),
        averageRiskReward
      };
    });

    const tradesPerDay = Object.values(byDay).map(trades => trades.length);
    const averageTradesPerDay = tradesPerDay.length ? tradesPerDay.reduce((a, b) => a + b, 0) / tradesPerDay.length : 0;
    const maximumTradesDay = tradesPerDay.length ? Math.max(...tradesPerDay) : 0;
    const singleTradeDays = tradesPerDay.filter(number => number === 1).length;
    const overtradingDays = tradesPerDay.filter(number => number > 7).length;

    const total = trades.length;
    const averageWin = wins.length ? wins.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0) / wins.length : 0;
    const averageLoss = losses.length ? losses.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0) / losses.length : 0;
    const winRate = calculateWinRate(wins.length, total);
    const lossRate = total ? (losses.length / total) * 100 : 0;
    const expectancy = calculateExpectancy(averageWin, winRate, averageLoss, lossRate);

    const strategyProfits: Record<string, number> = {};
    trades.forEach(trade => {
      if (trade.strategy?.name)
        strategyProfits[trade.strategy.name] = (strategyProfits[trade.strategy.name] ?? 0) + (trade.pnl_amount ?? 0);
    });
    const mostProfitableStrategyName = Object.entries(strategyProfits).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    return {
      total,
      wins: wins.length,
      losses: losses.length,
      breakEven: breakEven.length,
      averageWin,
      averageLoss,
      winRate,
      expectancy,
      dailyWinDays: dailyWinDays.length,
      dailyLossDays: dailyLossDays.length,
      bestDay,
      worstDay,
      maximumCapital, 
      minimumCapital, 
      averageCapital,
      maximumQuantity, 
      minimumQuantity, 
      averageQuantity,
      capitalProfitLossAtMaximum: trades.filter(trade => trade.total_amount === maximumCapital).reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0),
      capitalProfitLossAtMinimum: trades.filter(trade => trade.total_amount === minimumCapital).reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0),
      quantityProfitLossAtMaximum: byQuantity[maximumQuantity].reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0),
      quantityProfitLossAtMinimum: byQuantity[minimumQuantity].reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0),
      averageRiskReward,
      setupStats,
      strategies,
      symbolStatistics,
      mostTraded,
      mostProfitable,
      leastProfitable,
      highestWinRate,
      lowestWinRate,
      maximumConsecutiveWins,
      maximumConsecutiveLosses,
      maximumConsecutiveWinDays,
      maximumConsecutiveLossDays,
      tradesByWeekday,
      weekdayData,
      averageTradesPerDay,
      maximumTradesDay,
      singleTradeDays,
      overtradingDays,
      mostProfitableStrategyName
    };
  }, [trades]);

  if (!stats) {
    return <div className={Styles.noTrades}>No trades found for this period.</div>;
  }

  return (
    <div className={Styles.dashboard}>
      <header className={Styles.header}>
        <h1 className={Styles.title}>Trading Performance</h1>
        <div className={Styles.summaryCards}>
          <div className={`${Styles.summaryCard} ${Styles.primaryCard}`}>
            <div className={Styles.summaryLabel}>Total Trades</div>
            <div className={Styles.summaryValue}>{stats.total}</div>
          </div>
          <div className={`${Styles.summaryCard} ${stats.winRate >= 50 ? Styles.successCard : Styles.dangerCard}`}>
            <div className={Styles.summaryLabel}>Win Rate</div>
            <div className={Styles.summaryValue}>{stats.winRate.toFixed(1)}%</div>
          </div>
          <div className={`${Styles.summaryCard} ${Styles.primaryCard}`}>
            <div className={Styles.summaryLabel}>Expectancy</div>
            <div className={Styles.summaryValue}>{formatCurrency(stats.expectancy, 2)}</div>
          </div>
        </div>
      </header>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Key Metrics</h2>
        <div className={Styles.metricsGrid}>
          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Profit & Loss</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Win</span>
                  <span className={`${Styles.metricValue} ${Styles.positive}`}>{formatCurrency(stats.averageWin, 2)}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Loss</span>
                  <span className={`${Styles.metricValue} ${Styles.negative}`}>{formatCurrency(stats.averageLoss, 2)}</span>
                </div>
              </div>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Best Day</span>
                  <span className={`${Styles.metricValue} ${Styles.positive}`}>
                    {stats.bestDay ? formatCurrency(stats.bestDay.profitLoss) : "--"}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Worst Day</span>
                  <span className={`${Styles.metricValue} ${Styles.negative}`}>
                    {stats.worstDay ? formatCurrency(stats.worstDay.profitLoss) : "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Streaks</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Maximum Consecutive Wins</span>
                  <span className={`${Styles.metricValue} ${Styles.positive}`}>{stats.maximumConsecutiveWins}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Maximum Consecutive Losses</span>
                  <span className={`${Styles.metricValue} ${Styles.negative}`}>{stats.maximumConsecutiveLosses}</span>
                </div>
              </div>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Maximum Winning Days</span>
                  <span className={`${Styles.metricValue} ${Styles.positive}`}>{stats.maximumConsecutiveWinDays}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Maximum Losing Days</span>
                  <span className={`${Styles.metricValue} ${Styles.negative}`}>{stats.maximumConsecutiveLossDays}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Activity</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Trades Per Day</span>
                  <span className={Styles.metricValue}>{stats.averageTradesPerDay.toFixed(1)}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Maximum Trades In A Day</span>
                  <span className={Styles.metricValue}>{stats.maximumTradesDay}</span>
                </div>
              </div>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Single Trade Days</span>
                  <span className={Styles.metricValue}>{stats.singleTradeDays}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Overtrading Days</span>
                  <span className={Styles.metricValue}>{stats.overtradingDays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Capital & Risk</h2>
        <div className={Styles.metricsGrid}>
          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Capital Usage</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Maximum Capital</span>
                  <span className={Styles.metricValue}>{formatCurrency(stats.maximumCapital)}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Minimum Capital</span>
                  <span className={Styles.metricValue}>{formatCurrency(stats.minimumCapital)}</span>
                </div>
              </div>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Capital</span>
                  <span className={Styles.metricValue}>{formatCurrency(stats.averageCapital)}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Profit/Loss At Maximum Capital</span>
                  <span className={`${Styles.metricValue} ${stats.capitalProfitLossAtMaximum >= 0 ? Styles.positive : Styles.negative}`}>
                    {formatCurrency(stats.capitalProfitLossAtMaximum)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Quantity Analysis</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Maximum Quantity</span>
                  <span className={Styles.metricValue}>{stats.maximumQuantity}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Minimum Quantity</span>
                  <span className={Styles.metricValue}>{stats.minimumQuantity}</span>
                </div>
              </div>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Quantity</span>
                  <span className={Styles.metricValue}>{stats.averageQuantity.toFixed(1)}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Profit/Loss At Maximum Quantity</span>
                  <span className={`${Styles.metricValue} ${stats.quantityProfitLossAtMaximum >= 0 ? Styles.positive : Styles.negative}`}>
                    {formatCurrency(stats.quantityProfitLossAtMaximum)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Risk Metrics</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Risk:Reward</span>
                  <span className={Styles.metricValue}>{stats.averageRiskReward.toFixed(2)}</span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Most Profitable Strategy</span>
                  <span className={`${Styles.metricValue} ${Styles.positive}`}>{stats.mostProfitableStrategyName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Symbols & Strategies</h2>
        <div className={Styles.doubleColumn}>
          <div className={Styles.dataCard}>
            <div className={Styles.dataHeader}>
              <h3>Symbol Performance</h3>
            </div>
            <div className={Styles.dataBody}>
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
                    <td>{stats.mostTraded?.symbol}</td>
                    <td>{stats.mostTraded?.count} trades</td>
                  </tr>
                  <tr>
                    <td>Most Profitable</td>
                    <td>{stats.mostProfitable?.symbol}</td>
                    <td className={Styles.positive}>{formatCurrency(stats.mostProfitable?.profit)}</td>
                  </tr>
                  <tr>
                    <td>Least Profitable</td>
                    <td>{stats.leastProfitable?.symbol}</td>
                    <td className={Styles.negative}>{formatCurrency(stats.leastProfitable?.profit)}</td>
                  </tr>
                  <tr>
                    <td>Highest Win Rate</td>
                    <td>{stats.highestWinRate?.symbol}</td>
                    <td className={Styles.positive}>{stats.highestWinRate?.winRate.toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Lowest Win Rate</td>
                    <td>{stats.lowestWinRate?.symbol}</td>
                    <td className={Styles.negative}>{stats.lowestWinRate?.winRate.toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={Styles.dataCard}>
            <div className={Styles.dataHeader}>
              <h3>Strategy Effectiveness</h3>
            </div>
            <div className={Styles.dataBody}>
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
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Weekday Performance</h2>
        <div className={Styles.fullWidthCard}>
          <div className={Styles.dataHeader}>
            <h3>Performance by Day of Week</h3>
          </div>
          <div className={Styles.dataBody}>
            <table className={Styles.dataTable}>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Trades</th>
                  <th>Profit/Loss</th>
                  <th>Win Rate</th>
                  <th>Average Risk:Reward</th>
                </tr>
              </thead>
              <tbody>
                {stats.weekdayData.map(dayData => (
                  <tr key={dayData.day}>
                    <td>{dayData.day}</td>
                    <td>{dayData.trades}</td>
                    <td className={dayData.profitLoss >= 0 ? Styles.positive : Styles.negative}>
                      {formatCurrency(dayData.profitLoss)}
                    </td>
                    <td className={dayData.winRate >= 50 ? Styles.positive : Styles.negative}>
                      {dayData.winRate ? dayData.winRate.toFixed(1) + "%" : "--"}
                    </td>
                    <td>{dayData.averageRiskReward ? dayData.averageRiskReward.toFixed(2) : "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Performance;