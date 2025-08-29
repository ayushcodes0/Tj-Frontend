import { useEffect, useMemo } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./Dashboard.module.css";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { NavLink } from "react-router-dom";
import { useFilters } from "../../hooks/useFilters";

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

const COLORS = ["var(--dashboard-green-color)", "var(--dashboard-red-color)", "#ffcc7d", "#ff6f91", "#437de8", "#2dd7ef", "#ffa500", "#e44b43", "#67b7dc", "#a683e3"];

function formatDateLabel(date: string) {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

const Dashboard = () => {
  const { trades, loading, fetchTrades } = useTrades();
  const { filter, year, month, day, week, setFilter, setYear, setMonth, setDay, setWeek } = useFilters();

  const getMaxDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Your existing change handlers remain the same...
  const handleYearChange = (value: string) => {
    setYear(value);
  };
  const handleYearBlur = () => {
    const validatedYear = Math.max(2000, Math.min(2100, Number(year) || getCurrentYear()));
    setYear(validatedYear);
    const maxDay = getMaxDaysInMonth(validatedYear, Number(month) || getCurrentMonth());
    if (Number(day) > maxDay) {
      setDay(maxDay);
    }
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
  };
  const handleMonthBlur = () => {
    const validatedMonth = Math.max(1, Math.min(12, Number(month) || getCurrentMonth()));
    setMonth(validatedMonth);
    const maxDay = getMaxDaysInMonth(Number(year) || getCurrentYear(), validatedMonth);
    if (Number(day) > maxDay) {
      setDay(maxDay);
    }
  };

  const handleWeekChange = (value: string) => {
    setWeek(value);
  };
  const handleWeekBlur = () => {
    const validatedWeek = Math.max(1, Math.min(53, Number(week) || getCurrentWeek()));
    setWeek(validatedWeek);
  };

  const handleDayChange = (value: string) => {
    setDay(value);
  };
  const handleDayBlur = () => {
    const maxDay = getMaxDaysInMonth(Number(year) || getCurrentYear(), Number(month) || getCurrentMonth());
    const validatedDay = Math.max(1, Math.min(maxDay, Number(day) || 1));
    setDay(validatedDay);
  };

  useEffect(() => {
    const currentYear = Number(year);
    const currentMonth = Number(month);
    const currentDay = Number(day);
    const currentWeek = Number(week);

    if (filter === "lifetime") {
      fetchTrades("lifetime", {});
    } else if (filter === "year" && !isNaN(currentYear)) {
      fetchTrades("year", { year: currentYear });
    } else if (filter === "week" && !isNaN(currentYear) && !isNaN(currentWeek)) {
      fetchTrades("week", { year: currentYear, week: currentWeek });
    } else if (filter === "day" && !isNaN(currentYear) && !isNaN(currentMonth) && !isNaN(currentDay)) {
      fetchTrades("day", { year: currentYear, month: currentMonth, day: currentDay });
    }
  }, [filter, year, month, day, week, fetchTrades]);

  // All your existing useMemo calculations...
  const stats = useMemo(() => {
    if (!trades) return null;
    const totalTrades = trades.length;
    const winTrades = trades.filter(t => (t.pnl_amount ?? 0) > 0);
    const lossTrades = trades.filter(t => (t.pnl_amount ?? 0) < 0);
    const breakEvenTrades = trades.filter(t => (t.pnl_amount ?? 0) === 0);
    const grossPnl = trades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0);
    const avgPnl = totalTrades ? grossPnl / totalTrades : 0;
    const winRate = totalTrades ? (winTrades.length / totalTrades) * 100 : 0;
    
    const bestTrade = totalTrades === 0 ? null : trades.reduce((a, b) => 
      ((a.pnl_amount ?? -Infinity) > (b.pnl_amount ?? -Infinity) ? a : b)
    );
    const worstTrade = totalTrades === 0 ? null : trades.reduce((a, b) => 
      ((a.pnl_amount ?? Infinity) < (b.pnl_amount ?? Infinity) ? a : b)
    );

    return {
      totalTrades,
      wins: winTrades.length,
      losses: lossTrades.length,
      breakEvens: breakEvenTrades.length,
      grossPnl,
      avgPnl,
      winRate,
      bestTrade,
      worstTrade,
    };
  }, [trades]);

  const confidence = useMemo(() => {
    if (!trades) return null;
    const levels = trades
      .map(t => t.psychology?.entry_confidence_level)
      .filter((lvl): lvl is number => typeof lvl === 'number' && !isNaN(lvl));
    if (levels.length === 0) return null;
    const average = levels.reduce((a, b) => a + b, 0) / levels.length;
    return {
      average,
      count: levels.length
    };
  }, [trades]);

  const directionData = useMemo(() => {
    if (!trades) return [];
    const longs = trades.filter(t => t.direction === "Long").length;
    const shorts = trades.filter(t => t.direction === "Short").length;
    return [
      { name: "Long", value: longs },
      { name: "Short", value: shorts }
    ].filter(d => d.value > 0);
  }, [trades]);

  const holdingBySymbol = useMemo(() => {
    if (!trades) return [];
    const symMap: Record<string, { name: string, sum: number, count: number }> = {};
    for (const t of trades) {
      const sym = t.symbol || "Unknown";
      if (!symMap[sym]) symMap[sym] = { name: sym, sum: 0, count: 0 };
      if (typeof t.holding_period_minutes === "number" && !isNaN(t.holding_period_minutes)) {
        symMap[sym].sum += t.holding_period_minutes;
        symMap[sym].count += 1;
      }
    }
    return Object.values(symMap)
      .filter(x => x.count > 0)
      .map(x => ({
        name: x.name,
        avgMinutes: Number((x.sum / x.count).toFixed(2))
      }))
      .sort((a, b) => b.avgMinutes - a.avgMinutes);
  }, [trades]);

  // NEW: Stocks/Equity Performance Data
  const stocksEquityData = useMemo(() => {
    if (!trades) return [];
    const symbolMap: Record<string, { name: string, count: number, totalPnl: number, winRate: number }> = {};
    
    for (const trade of trades) {
      const symbol = trade.symbol || "Unknown";
      if (!symbolMap[symbol]) {
        symbolMap[symbol] = { 
          name: symbol, 
          count: 0, 
          totalPnl: 0, 
          winRate: 0 
        };
      }
      symbolMap[symbol].count += 1;
      symbolMap[symbol].totalPnl += (trade.pnl_amount ?? 0);
    }

    // Calculate win rate for each symbol
    for (const symbol in symbolMap) {
      const symbolTrades = trades.filter(t => t.symbol === symbol);
      const winningTrades = symbolTrades.filter(t => (t.pnl_amount ?? 0) > 0);
      symbolMap[symbol].winRate = symbolTrades.length > 0 
        ? (winningTrades.length / symbolTrades.length) * 100 
        : 0;
    }

    return Object.values(symbolMap)
      .sort((a, b) => b.totalPnl - a.totalPnl) // Sort by total PnL descending
      .slice(0, 10); // Show top 10 stocks
  }, [trades]);

  // NEW: Strategy PnL Data
  const strategyPnLData = useMemo(() => {
    if (!trades) return [];
    
    const strategyMap = new Map();
    
    trades.forEach(trade => {
      const strategyName = trade.strategy?.name || 'Other';
      const pnl = trade.pnl_amount ?? 0;
      
      if (!strategyMap.has(strategyName)) {
        strategyMap.set(strategyName, { 
          strategy: strategyName, 
          profit: 0, 
          loss: 0,
          netPnL: 0 
        });
      }
      
      const stats = strategyMap.get(strategyName);
      if (pnl >= 0) {
        stats.profit += pnl;
      } else {
        stats.loss += Math.abs(pnl);
      }
      stats.netPnL += pnl;
    });
    
    return Array.from(strategyMap.values())
      .sort((a, b) => b.netPnL - a.netPnL); // Sort by net P&L
  }, [trades]);

  const topTrades = useMemo(() => {
    if (!trades) return [];
    return [...trades]
      .sort((a, b) => (b.pnl_amount ?? 0) - (a.pnl_amount ?? 0))
      .slice(0, 5);
  }, [trades]);

  const timelineData = useMemo(() => {
    if (!trades) return [];
    const daily: Record<string, number> = {};
    for (const t of trades) {
      const dt = new Date(t.date).toISOString().slice(0, 10);
      daily[dt] = (daily[dt] ?? 0) + (t.pnl_amount ?? 0);
    }
    return Object.entries(daily)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, pnl]) => ({ date: formatDateLabel(date), pnl }));
  }, [trades]);

  const pieData = useMemo(() => {
    if (!trades) return [];
    const wins = trades.filter(t => (t.pnl_amount ?? 0) > 0).length;
    const losses = trades.filter(t => (t.pnl_amount ?? 0) < 0).length;
    const neutral = trades.filter(t => (t.pnl_amount ?? 0) === 0).length;
    return [
      { name: "Win", value: wins },
      { name: "Loss", value: losses },
      { name: "BreakEven", value: neutral },
    ].filter(d => d.value > 0);
  }, [trades]);

  const strategyData = useMemo(() => {
    if (!trades) return [];
    const stratMap: Record<string, { name: string, count: number }> = {};
    for (const t of trades) {
      const name = t.strategy?.name || "Other";
      stratMap[name] = stratMap[name] || { name, count: 0 };
      stratMap[name].count += 1;
    }
    return Object.values(stratMap).sort((a, b) => b.count - a.count);
  }, [trades]);

  const mistakeData = useMemo(() => {
    if (!trades) return [];
    const map: Record<string, number> = {};
    for (const t of trades) {
      t.psychology?.mistakes_made?.forEach(m => {
        map[m] = (map[m] ?? 0) + 1;
      });
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [trades]);

  return (
    <div className={Styles.dashboardPage}>
      <div className={Styles.dashboardFilters}>
        <select
          className={Styles.filterInputs}
          value={filter}
          onChange={e => setFilter(e.target.value as 'lifetime' | 'week' | 'year' | 'day')}
        >
          {FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        {(filter === "year" || filter === "week" || filter === "day") && (
          <input
            className={Styles.filterInputs}
            type="number"
            min={2000}
            max={2100}
            value={year}
            onChange={e => handleYearChange(e.target.value)}
            onBlur={handleYearBlur}
            style={{ maxWidth: "80px" }}
            placeholder="Year"
          />
        )}
        {filter === "week" && (
          <input
            className={Styles.filterInputs}
            type="number"
            min={1}
            max={53}
            value={week}
            onChange={e => handleWeekChange(e.target.value)}
            onBlur={handleWeekBlur}
            style={{ maxWidth: "65px" }}
            placeholder="Week"
          />
        )}
        {filter === "day" && (
          <>
            <input
              className={Styles.filterInputs}
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={e => handleMonthChange(e.target.value)}
              onBlur={handleMonthBlur}
              style={{ maxWidth: "55px" }}
              placeholder="Month"
            />
            <input
              className={Styles.filterInputs}
              type="number"
              min={1}
              max={getMaxDaysInMonth(Number(year) || getCurrentYear(), Number(month) || getCurrentMonth())}
              value={day}
              onChange={e => handleDayChange(e.target.value)}
              onBlur={handleDayBlur}
              style={{ maxWidth: "46px" }}
              placeholder="Day"
            />
          </>
        )}
      </div>

      {loading && <div className={Styles.noTradesFound} style={{ fontSize: 18, marginLeft: 10, marginTop: 20 }}>Loading dashboard...</div>}
      {(!trades || trades.length === 0) && !loading && (
        <div className={Styles.noTradesFound} style={{ fontSize: 18, marginLeft: 10, marginTop: 20 }}>No trades found for this period.</div>
      )}

      {stats && <div className={Styles.dashboardStatsCards}>
        <div className={Styles.statCard}>
          <span className={Styles.statLabel}>Gross P&L (₹)</span>
          <span className={Styles.statValue} style={{color: stats.grossPnl >= 0 ? 'var(--dashboard-green-color)' : '#e44b43'}}>
            {stats.grossPnl.toLocaleString(undefined, {maximumFractionDigits: 0})}
          </span>
        </div>
        <div className={Styles.statCard}>
          <span className={Styles.statLabel}>Total Trades</span>
          <span className={Styles.statValue}>{stats.totalTrades}</span>
        </div>
        <div className={Styles.statCard}>
          <span className={Styles.statLabel}>Win Rate</span>
          <span className={Styles.statValue}>{stats.winRate.toFixed(1)}%</span>
        </div>
        <div className={Styles.statCard}>
          <span className={Styles.statLabel}>Avg P&L</span>
          <span className={Styles.statValue}>{stats.avgPnl.toFixed(1)}</span>
        </div>
        <div className={Styles.statCard}>
          <span className={Styles.statLabel}>Best Trade</span>
          <span className={Styles.statValue} style={{color:'var(--dashboard-green-color)'}}>
            {stats.bestTrade ? `₹${(stats.bestTrade.pnl_amount ?? 0).toLocaleString()}` : "-"}
          </span>
        </div>
        <div className={Styles.statCard}>
          <span className={Styles.statLabel}>Worst Trade</span>
          <span className={Styles.statValue} style={{color:'var(--dashboard-red-color)'}}>
            {stats.worstTrade ? `₹${(stats.worstTrade.pnl_amount ?? 0).toLocaleString()}` : "-"}
          </span>
        </div>
      </div>}

      {confidence &&
      <div className={Styles.confidenceWrapper}>
        <div className={Styles.confidenceLabelRow}>
          <span className={Styles.confidenceLabel}>Avg Confidence Level</span>
          <span className={Styles.confidenceVal}>
            {confidence.average.toFixed(2)} / 10
            <span style={{color: "#c1bcd1", fontWeight: 500, fontSize: 12, marginLeft: 8}}>
              ({confidence.count} {confidence.count === 1 ? "trade" : "trades"})
            </span>
          </span>
        </div>
        <div className={Styles.confidenceBar}>
          <div
            className={Styles.confidenceBarInner}
            style={{
              width: `${(confidence.average / 10) * 100}%`
            }}
          />
        </div>
        <div className={Styles.confidenceScaleLabels}>
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    }

      <div className={Styles.dashboardCharts}>
        <div className={Styles.chartBox}>
          <div className={Styles.chartHeading}>P&L Over Time</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="2 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pnl" stroke="var(--dashboard-green-color)" strokeWidth={3} name="P&L" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={Styles.chartBox}>
          <div className={Styles.chartHeading}>Win/Loss Ratio</div>
          <ResponsiveContainer height={220} width="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={84}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend verticalAlign="bottom" align="center" iconType="circle" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={Styles.chartBox}>
          <div className={Styles.chartHeading}>Strategy Usage</div>
          <ResponsiveContainer height={220} width="100%">
            <BarChart data={strategyData}>
              <CartesianGrid strokeDasharray="2 5" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="count" fill="#618bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={Styles.chartBox}>
          <div className={Styles.chartHeading}>Trading Mistakes</div>
          <ResponsiveContainer height={220} width="100%">
            <BarChart data={mistakeData}>
              <CartesianGrid strokeDasharray="2 5" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="value" fill="#618bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={Styles.chartBox}>
        <div className={Styles.chartHeading}>Trade Direction</div>
          <ResponsiveContainer height={240} width="100%">
            <PieChart>
              <Pie
                data={directionData}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={78}
                fill="var(--dashboard-green-color)"
                label
              >
                {directionData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length] || "var(--dashboard-green-color)"} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" align="center" iconType="circle" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={Styles.chartBox}>
          <div className={Styles.chartHeading}>Avg Holding Period by Symbol</div>
          <ResponsiveContainer height={220} width="100%">
            <BarChart data={holdingBySymbol} layout="vertical">
              <CartesianGrid strokeDasharray="2 5" />
              <XAxis type="number" label={{ value: 'Minutes', position: 'insideBottomRight', offset: -5 }} />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="avgMinutes" fill="var(--dashboard-green-color)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stocks / Equity Performance Chart */}
        <div className={Styles.chartBox}>
          <div className={Styles.chartHeading}>Stocks / Equity Performance</div>
          <ResponsiveContainer height={300} width="100%">
            <BarChart data={stocksEquityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                label={{ value: 'Trade Count', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                label={{ value: 'Total P&L (₹)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Total P&L (₹)') {
                    return [`₹${Number(value).toLocaleString()}`, name];
                  }
                  if (name === 'Win Rate (%)') {
                    return [`${Number(value).toFixed(1)}%`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="count" 
                fill="#8884d8" 
                name="Trade Count" 
              />
              <Bar 
                yAxisId="right" 
                dataKey="totalPnl" 
                fill="#82ca9d" 
                name="Total P&L (₹)" 
              />
              <Bar 
                yAxisId="left" 
                dataKey="winRate" 
                fill="#ffc658" 
                name="Win Rate (%)" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit & Loss by Strategy Chart */}
        <div className={Styles.chartBox}>
          <div className={Styles.chartHeading}>Profit & Loss by Strategy</div>
          <ResponsiveContainer height={300} width="100%">
            <BarChart data={strategyPnLData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="strategy" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
              <Tooltip 
                formatter={(value, name) => {
                  const formattedValue = `₹${Number(value).toLocaleString()}`;
                  return [formattedValue, name];
                }}
                labelFormatter={(label) => `Strategy: ${label}`}
              />
              <Legend />
              <Bar dataKey="profit" stackId="a" fill="#4caf50" name="Total Profit" />
              <Bar dataKey="loss" stackId="a" fill="#f44336" name="Total Loss" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {topTrades.length > 0 && (
        <div className={Styles.topTradesSection}>
          <div className={Styles.topTradesHeading}>
            <p className={Styles.heading}>Top Trades</p>
            <NavLink to={"/dashboard/trades"} ><p className={Styles.viewAll}>View all</p></NavLink>
          </div>
          <div className={Styles.topTradesTableWrapper}>
            <table className={Styles.topTradesTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Direction</th>
                  <th>P&L (₹)</th>
                  <th>P&L (%)</th>
                  <th>Entry</th>
                  <th>Exit</th>
                </tr>
              </thead>
              <tbody>
                {topTrades.map((trade, i) => (
                  <tr key={trade._id}>
                    <td>{i + 1}</td>
                    <td>{new Date(trade.date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={trade.direction === "Long" ? Styles.long : Styles.short}
                      >
                        {trade.direction}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: (trade.pnl_amount ?? 0) >= 0 ? 'var(--dashboard-green-color)' : 'var(--dashboard-red-color)' }}>
                        {typeof trade.pnl_amount === "number" ? trade.pnl_amount.toLocaleString(undefined, {maximumFractionDigits: 2}) : "-"}
                      </span>
                    </td>
                    <td>
                      {typeof trade.pnl_percentage === "number"
                        ? trade.pnl_percentage.toFixed(2)
                        : "-"}
                      %
                    </td>
                    <td>{trade.entry_price ?? "-"}</td>
                    <td>{trade.exit_price ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
