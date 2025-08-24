import { useEffect, useMemo, useState } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./Performance.module.css";
import type { Trade } from "../../context/TradeContext";

// Define a type for the related data objects
interface RelatedObject {
  _id: string;
  name: string;
}

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;
const getCurrentWeek = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

const FILTERS = [
  { label: 'Last Week', value: 'week' as const },
  { label: 'Last Year', value: 'year' as const },
  { label: 'Lifetime', value: 'lifetime' as const },
  { label: 'Specific Day', value: 'day' as const },
];

const formatCurrency = (num: number | undefined, decimals: number = 0): string =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: decimals })
    : "--";

const calculateWinRate = (wins: number, total: number): number =>
  total > 0 ? (wins / total) * 100 : 0;

const calculateExpectancy = (averageWin: number, winRate: number, averageLoss: number, lossRate: number): number =>
  (averageWin * (winRate / 100)) - (Math.abs(averageLoss) * (lossRate / 100));

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Performance = () => {
  const { trades, fetchTrades } = useTrades();
  const [filter, setFilter] = useState<'lifetime' | 'week' | 'year' | 'day'>('lifetime');
  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());
  const [day, setDay] = useState(new Date().getDate());
  const [week, setWeek] = useState(getCurrentWeek());

  // Helper function to get max days in a month
  const getMaxDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Input validation handlers
  const handleYearChange = (value: number) => {
    const validatedYear = Math.max(2000, Math.min(2100, value));
    setYear(validatedYear);
    
    const maxDay = getMaxDaysInMonth(validatedYear, month);
    if (day > maxDay) {
      setDay(maxDay);
    }
  };

  const handleMonthChange = (value: number) => {
    const validatedMonth = Math.max(1, Math.min(12, value));
    setMonth(validatedMonth);
    
    const maxDay = getMaxDaysInMonth(year, validatedMonth);
    if (day > maxDay) {
      setDay(maxDay);
    }
  };

  const handleWeekChange = (value: number) => {
    const validatedWeek = Math.max(1, Math.min(53, value));
    setWeek(validatedWeek);
  };

  const handleDayChange = (value: number) => {
    const maxDay = getMaxDaysInMonth(year, month);
    const validatedDay = Math.max(1, Math.min(maxDay, value));
    setDay(validatedDay);
  };

  // Fetch trades based on local filter state
  useEffect(() => {
    if (filter === "lifetime") {
      fetchTrades("lifetime", {});
    } else if (filter === "year") {
      fetchTrades("year", { year });
    } else if (filter === "week") {
      fetchTrades("week", { year, week });
    } else if (filter === "day") {
      fetchTrades("day", { year, month, day });
    }
  }, [filter, year, month, day, week, fetchTrades]);

  const stats = useMemo(() => {
    if (!trades || !trades.length) {
      return null;
    }
    
    const typedTrades = trades as Trade[];

    const wins = typedTrades.filter(trade => (trade.pnl_amount ?? 0) > 0);
    const losses = typedTrades.filter(trade => (trade.pnl_amount ?? 0) < 0);
    const breakEven = typedTrades.filter(trade => (trade.pnl_amount ?? 0) === 0);
    
    const byDay = typedTrades.reduce((acc: Record<string, Trade[]>, trade: Trade) => {
      const day = trade.date.slice(0, 10);
      acc[day] = acc[day] || [];
      acc[day].push(trade);
      return acc;
    }, {});

    const dailyProfits = Object.entries(byDay).map(([date, tradeList]) => ({
      date,
      profitLoss: tradeList.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0)
    }));

    const dailyWinDays = dailyProfits.filter(day => day.profitLoss > 0);
    const dailyLossDays = dailyProfits.filter(day => day.profitLoss < 0);
    const bestDay = dailyProfits.reduce(
      (best: { date: string, profitLoss: number } | null, current) => (!best || current.profitLoss > best.profitLoss) ? current : best,
      null
    );
    const worstDay = dailyProfits.reduce(
      (worst: { date: string, profitLoss: number } | null, current) => (!worst || current.profitLoss < worst.profitLoss) ? current : worst,
      null
    );

    const validCapital = typedTrades.map(trade => trade.total_amount).filter((val): val is number => typeof val === 'number');
    const maximumCapital = validCapital.length ? Math.max(...validCapital) : 0;
    const minimumCapital = validCapital.length ? Math.min(...validCapital) : 0;
    const averageCapital = validCapital.length ? validCapital.reduce((sum, val) => sum + val, 0) / validCapital.length : 0;
    
    const validQuantities = typedTrades.map(trade => trade.quantity).filter((val): val is number => typeof val === 'number');
    const maximumQuantity = validQuantities.length ? Math.max(...validQuantities) : 0;
    const minimumQuantity = validQuantities.length ? Math.min(...validQuantities) : 0;
    const averageQuantity = validQuantities.length ? validQuantities.reduce((sum, val) => sum + val, 0) / validQuantities.length : 0;

    const capitalProfitLossAtMaximum = typedTrades.filter(trade => trade.total_amount === maximumCapital).reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
    const capitalProfitLossAtMinimum = typedTrades.filter(trade => trade.total_amount === minimumCapital).reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
    const quantityProfitLossAtMaximum = typedTrades.filter(trade => trade.quantity === maximumQuantity).reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
    const quantityProfitLossAtMinimum = typedTrades.filter(trade => trade.quantity === minimumQuantity).reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);

    const averageRiskReward = (() => {
      const riskRewardArray = typedTrades
        .filter(t => t.stop_loss !== undefined && t.entry_price !== undefined && t.exit_price !== undefined)
        .map(t => {
          const reward = Math.abs(t.exit_price! - t.entry_price!);
          const risk = Math.abs(t.entry_price! - t.stop_loss!);
          return risk !== 0 ? reward / risk : 0;
        })
        .filter(val => typeof val === "number" && isFinite(val) && val > 0);

      return riskRewardArray.length ? riskRewardArray.reduce((a, b) => a + b, 0) / riskRewardArray.length : 0;
    })();

    const strategyStats = Object.values(
      typedTrades.reduce((acc: Record<string, { name: string, trades: Trade[], wins: number, count: number, profit: number }>, trade: Trade) => {
        const name = (trade.strategy as RelatedObject)?.name || "Other";
        acc[name] = acc[name] || { name, trades: [], wins: 0, count: 0, profit: 0 };
        acc[name].trades.push(trade);
        acc[name].count = acc[name].trades.length;
        if ((trade.pnl_amount ?? 0) > 0) acc[name].wins++;
        acc[name].profit += (trade.pnl_amount ?? 0);
        return acc;
      }, {})
    ).map(s => ({
      name: s.name,
      winRate: calculateWinRate(s.wins, s.count),
      count: s.count,
      profit: s.profit
    })).sort((a, b) => b.count - a.count);

    const symbols = Array.from(new Set(typedTrades.map(t => t.symbol)));
    const symbolStatistics = symbols.map(symbol => {
      const tradesBySymbol = typedTrades.filter(trade => trade.symbol === symbol);
      const winCount = tradesBySymbol.filter(trade => (trade.pnl_amount ?? 0) > 0).length;
      const winRate = calculateWinRate(winCount, tradesBySymbol.length);
      const profit = tradesBySymbol.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
      return { symbol, count: tradesBySymbol.length, profit, winRate };
    });
    
    const mostTraded = symbolStatistics.length ? symbolStatistics.reduce((a, b) => a.count > b.count ? a : b) : null;
    const mostProfitable = symbolStatistics.length ? symbolStatistics.reduce((a, b) => a.profit > b.profit ? a : b) : null;
    const leastProfitable = symbolStatistics.length ? symbolStatistics.reduce((a, b) => a.profit < b.profit ? a : b) : null;
    const highestWinRate = symbolStatistics.length ? symbolStatistics.reduce((a, b) => a.winRate > b.winRate ? a : b) : null;
    const lowestWinRate = symbolStatistics.length ? symbolStatistics.reduce((a, b) => a.winRate < b.winRate ? a : b) : null;

    let consecutiveWins = 0, maximumConsecutiveWins = 0, consecutiveLosses = 0, maximumConsecutiveLosses = 0;
    for (const trade of typedTrades) {
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
    
    let maximumConsecutiveWinDays = 0, maximumConsecutiveLossDays = 0, streakType: 'win' | 'loss' | null = null, streak = 0;
    const sortedDailyProfits = dailyProfits.sort((a, b) => a.date.localeCompare(b.date));
    for (const day of sortedDailyProfits) {
      const isWinDay = day.profitLoss > 0;
      const isLossDay = day.profitLoss < 0;

      if (isWinDay) {
        if (streakType === 'win') {
          streak++;
        } else {
          streak = 1;
          streakType = 'win';
        }
        maximumConsecutiveWinDays = Math.max(maximumConsecutiveWinDays, streak);
      } else if (isLossDay) {
        if (streakType === 'loss') {
          streak++;
        } else {
          streak = 1;
          streakType = 'loss';
        }
        maximumConsecutiveLossDays = Math.max(maximumConsecutiveLossDays, streak);
      } else {
        streak = 0;
        streakType = null;
      }
    }

    const tradesByWeekday: Record<string, Trade[]> = weekdays.reduce((acc, day) => {
        acc[day] = [];
        return acc;
    }, {} as Record<string, Trade[]>);
    
    typedTrades.forEach(trade => {
        const weekday = weekdays[new Date(trade.date).getDay()];
        if (tradesByWeekday[weekday]) {
            tradesByWeekday[weekday].push(trade);
        }
    });

    const weekdayData = weekdays.map(day => {
      const tradesForDay = tradesByWeekday[day];
      const profitLoss = tradesForDay.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0);
      const wins = tradesForDay.filter(trade => (trade.pnl_amount ?? 0) > 0).length;
      
      const riskRewardArray = tradesForDay
        .filter(t => t.stop_loss !== undefined && t.entry_price !== undefined && t.exit_price !== undefined)
        .map(t => {
          const reward = Math.abs(t.exit_price! - t.entry_price!);
          const risk = Math.abs(t.entry_price! - t.stop_loss!);
          return risk !== 0 ? reward / risk : 0;
        })
        .filter(val => typeof val === "number" && isFinite(val) && val > 0);

      const averageRiskReward = riskRewardArray.length ? (riskRewardArray.reduce((a, b) => a + b, 0) / riskRewardArray.length) : null;

      return {
        day,
        trades: tradesForDay.length,
        profitLoss,
        winRate: calculateWinRate(wins, tradesForDay.length),
        averageRiskReward
      };
    });

    const tradesPerDay = Object.values(byDay).map(tradeList => tradeList.length);
    const averageTradesPerDay = tradesPerDay.length ? tradesPerDay.reduce((a, b) => a + b, 0) / tradesPerDay.length : 0;
    const maximumTradesDay = tradesPerDay.length ? Math.max(...tradesPerDay) : 0;
    const singleTradeDays = tradesPerDay.filter(number => number === 1).length;
    const overtradingDays = tradesPerDay.filter(number => number > 7).length;

    const total = typedTrades.length;
    const averageWin = wins.length ? wins.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0) / wins.length : 0;
    const averageLoss = losses.length ? losses.reduce((sum, trade) => sum + (trade.pnl_amount ?? 0), 0) / losses.length : 0;
    const winRate = calculateWinRate(wins.length, total);
    const lossRate = calculateWinRate(losses.length, total);
    const expectancy = calculateExpectancy(averageWin, winRate, averageLoss, lossRate);

    const mostProfitableStrategyName = strategyStats.length
      ? strategyStats.reduce((a, b) => a.profit > b.profit ? a : b).name
      : "-";

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
      capitalProfitLossAtMaximum,
      capitalProfitLossAtMinimum,
      quantityProfitLossAtMaximum,
      quantityProfitLossAtMinimum,
      averageRiskReward,
      strategyStats,
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

  const hasData = trades && trades.length > 0;

  return (
    <div className={Styles.dashboard}>
      <header className={Styles.header}>
        <h1 className={Styles.title}>Trading Performance</h1>
        <div className={Styles.dashboardFilters}>
          <div className={Styles.filterSelectRow}>
            <select
              className={Styles.filterSelect}
              value={filter}
              onChange={e => setFilter(e.target.value as 'lifetime' | 'week' | 'year' | 'day')}
            >
              {FILTERS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          
          <div className={Styles.filterInputsRow}>
            {(filter === "year" || filter === "week" || filter === "day") && (
              <input
                className={Styles.filterInput}
                type="number"
                min={2000}
                max={2100}
                value={year}
                onChange={e => handleYearChange(Number(e.target.value) || getCurrentYear())}
                onBlur={e => {
                  const value = Number(e.target.value);
                  if (isNaN(value) || value < 2000) handleYearChange(2000);
                  else if (value > 2100) handleYearChange(2100);
                }}
                placeholder="Year"
              />
            )}
            {filter === "week" && (
              <input
                className={Styles.filterInput}
                type="number"
                min={1}
                max={53}
                value={week}
                onChange={e => handleWeekChange(Number(e.target.value) || 1)}
                onBlur={e => {
                  const value = Number(e.target.value);
                  if (isNaN(value) || value < 1) handleWeekChange(1);
                  else if (value > 53) handleWeekChange(53);
                }}
                placeholder="Week"
              />
            )}
            {filter === "day" && (
              <>
                <input
                  className={Styles.filterInput}
                  type="number"
                  min={1}
                  max={12}
                  value={month}
                  onChange={e => handleMonthChange(Number(e.target.value) || 1)}
                  onBlur={e => {
                    const value = Number(e.target.value);
                    if (isNaN(value) || value < 1) handleMonthChange(1);
                    else if (value > 12) handleMonthChange(12);
                  }}
                  placeholder="Month"
                />
                <input
                  className={Styles.filterInput}
                  type="number"
                  min={1}
                  max={getMaxDaysInMonth(year, month)}
                  value={day}
                  onChange={e => handleDayChange(Number(e.target.value) || 1)}
                  onBlur={e => {
                    const value = Number(e.target.value);
                    const maxDay = getMaxDaysInMonth(year, month);
                    if (isNaN(value) || value < 1) handleDayChange(1);
                    else if (value > maxDay) handleDayChange(maxDay);
                  }}
                  placeholder="Day"
                />
              </>
            )}
          </div>
        </div>
        {hasData ? (
          <div className={Styles.summaryCards}>
            <div className={`${Styles.summaryCard} ${Styles.primaryCard}`}>
              <div className={Styles.summaryLabel}>Total Trades</div>
              <div className={Styles.summaryValue}>{stats?.total}</div>
            </div>
            <div className={`${Styles.summaryCard} ${stats?.winRate && stats.winRate >= 50 ? Styles.successCard : Styles.dangerCard}`}>
              <div className={Styles.summaryLabel}>Win Rate</div>
              <div className={Styles.summaryValue}>{stats?.winRate.toFixed(1)}%</div>
            </div>
            <div className={`${Styles.summaryCard} ${Styles.primaryCard}`}>
              <div className={Styles.summaryLabel}>Expectancy</div>
              <div className={Styles.summaryValue}>{formatCurrency(stats?.expectancy, 2)}</div>
            </div>
          </div>
        ) : (
          <div className={Styles.noTrades}>No trades found for this period.</div>
        )}
      </header>

      {hasData && (
        <>
          <hr className={Styles.horizontalLine} />
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
                      <span className={`${Styles.metricValue} ${Styles.positive}`}>{formatCurrency(stats?.averageWin, 2)}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Average Loss</span>
                      <span className={`${Styles.metricValue} ${Styles.negative}`}>{formatCurrency(stats?.averageLoss, 2)}</span>
                    </div>
                  </div>
                  <div className={Styles.metricRow}>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Best Day</span>
                      <span className={`${Styles.metricValue} ${Styles.positive}`}>
                        {stats?.bestDay ? formatCurrency(stats.bestDay.profitLoss) : "--"}
                      </span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Worst Day</span>
                      <span className={`${Styles.metricValue} ${Styles.negative}`}>
                        {stats?.worstDay ? formatCurrency(stats.worstDay.profitLoss) : "--"}
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
                      <span className={`${Styles.metricValue} ${Styles.positive}`}>{stats?.maximumConsecutiveWins}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Maximum Consecutive Losses</span>
                      <span className={`${Styles.metricValue} ${Styles.negative}`}>{stats?.maximumConsecutiveLosses}</span>
                    </div>
                  </div>
                  <div className={Styles.metricRow}>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Maximum Winning Days</span>
                      <span className={`${Styles.metricValue} ${Styles.positive}`}>{stats?.maximumConsecutiveWinDays}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Maximum Losing Days</span>
                      <span className={`${Styles.metricValue} ${Styles.negative}`}>{stats?.maximumConsecutiveLossDays}</span>
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
                      <span className={Styles.metricValue}>{stats?.averageTradesPerDay.toFixed(1)}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Maximum Trades In A Day</span>
                      <span className={Styles.metricValue}>{stats?.maximumTradesDay}</span>
                    </div>
                  </div>
                  <div className={Styles.metricRow}>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Single Trade Days</span>
                      <span className={Styles.metricValue}>{stats?.singleTradeDays}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Overtrading Days</span>
                      <span className={Styles.metricValue}>{stats?.overtradingDays}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <hr className={Styles.horizontalLine} />
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
                      <span className={Styles.metricValue}>{formatCurrency(stats?.maximumCapital)}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Minimum Capital</span>
                      <span className={Styles.metricValue}>{formatCurrency(stats?.minimumCapital)}</span>
                    </div>
                  </div>
                  <div className={Styles.metricRow}>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Average Capital</span>
                      <span className={Styles.metricValue}>{formatCurrency(stats?.averageCapital)}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Profit/Loss At Maximum Capital</span>
                      <span className={`${Styles.metricValue} ${stats?.capitalProfitLossAtMaximum && stats.capitalProfitLossAtMaximum >= 0 ? Styles.positive : Styles.negative}`}>
                        {formatCurrency(stats?.capitalProfitLossAtMaximum)}
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
                      <span className={Styles.metricValue}>{stats?.maximumQuantity}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Minimum Quantity</span>
                      <span className={Styles.metricValue}>{stats?.minimumQuantity}</span>
                    </div>
                  </div>
                  <div className={Styles.metricRow}>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Average Quantity</span>
                      <span className={Styles.metricValue}>{stats?.averageQuantity.toFixed(1)}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Profit/Loss At Maximum Quantity</span>
                      <span className={`${Styles.metricValue} ${stats?.quantityProfitLossAtMaximum && stats.quantityProfitLossAtMaximum >= 0 ? Styles.positive : Styles.negative}`}>
                        {formatCurrency(stats?.quantityProfitLossAtMaximum)}
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
                      <span className={Styles.metricValue}>{stats?.averageRiskReward?.toFixed(2) ?? "--"}</span>
                    </div>
                    <div className={Styles.metricItem}>
                      <span className={Styles.metricLabel}>Most Profitable Strategy</span>
                      <span className={`${Styles.metricValue} ${Styles.positive}`}>{stats?.mostProfitableStrategyName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <hr className={Styles.horizontalLine} />
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
                        <td>{stats?.mostTraded?.symbol ?? "--"}</td>
                        <td>{stats?.mostTraded?.count ?? "--"} trades</td>
                      </tr>
                      <tr>
                        <td>Most Profitable</td>
                        <td>{stats?.mostProfitable?.symbol ?? "--"}</td>
                        <td className={stats?.mostProfitable && stats.mostProfitable.profit >= 0 ? Styles.positive : Styles.negative}>{formatCurrency(stats?.mostProfitable?.profit)}</td>
                      </tr>
                      <tr>
                        <td>Least Profitable</td>
                        <td>{stats?.leastProfitable?.symbol ?? "--"}</td>
                        <td className={stats?.leastProfitable && stats.leastProfitable.profit >= 0 ? Styles.positive : Styles.negative}>{formatCurrency(stats?.leastProfitable?.profit)}</td>
                      </tr>
                      <tr>
                        <td>Highest Win Rate</td>
                        <td>{stats?.highestWinRate?.symbol ?? "--"}</td>
                        <td className={stats?.highestWinRate && stats.highestWinRate.winRate >= 50 ? Styles.positive : Styles.negative}>{stats?.highestWinRate?.winRate.toFixed(1) ?? "--"}%</td>
                      </tr>
                      <tr>
                        <td>Lowest Win Rate</td>
                        <td>{stats?.lowestWinRate?.symbol ?? "--"}</td>
                        <td className={stats?.lowestWinRate && stats.lowestWinRate.winRate >= 50 ? Styles.positive : Styles.negative}>{stats?.lowestWinRate?.winRate.toFixed(1) ?? "--"}%</td>
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
                      {stats?.strategyStats.map(({ name, winRate, count }) => (
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
          <hr className={Styles.horizontalLine} />
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
                    {stats?.weekdayData.map(dayData => (
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
        </>
      )}
    </div>
  );
};

export default Performance;