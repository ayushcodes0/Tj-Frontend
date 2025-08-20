import { useEffect, useMemo, useState } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./Dashboard.module.css";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { NavLink } from "react-router-dom";

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
  const [filter, setFilter] = useState<'lifetime' | 'week' | 'year' | 'day'>('week');
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
    
    // Adjust day if current day exceeds max days in the selected month/year
    const maxDay = getMaxDaysInMonth(validatedYear, month);
    if (day > maxDay) {
      setDay(maxDay);
    }
  };

  const handleMonthChange = (value: number) => {
    const validatedMonth = Math.max(1, Math.min(12, value));
    setMonth(validatedMonth);
    
    // Adjust day if current day exceeds max days in the selected month
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
    if (!trades) return null;
    const totalTrades = trades.length;
    const winTrades = trades.filter(t => (t.pnl_amount ?? 0) > 0);
    const lossTrades = trades.filter(t => (t.pnl_amount ?? 0) < 0);
    const breakEvenTrades = trades.filter(t => (t.pnl_amount ?? 0) === 0);
    const grossPnl = trades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0);
    const avgPnl = totalTrades ? grossPnl / totalTrades : 0;
    const winRate = totalTrades ? (winTrades.length / totalTrades) * 100 : 0;
    
    // Fixed: Check for empty array first, then use reduce without initial value
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
      const dt = t.date.slice(0, 10);
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
            onChange={e => handleYearChange(Number(e.target.value) || getCurrentYear())}
            onBlur={e => {
              const value = Number(e.target.value);
              if (isNaN(value) || value < 2000) handleYearChange(2000);
              else if (value > 2100) handleYearChange(2100);
            }}
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
            onChange={e => handleWeekChange(Number(e.target.value) || 1)}
            onBlur={e => {
              const value = Number(e.target.value);
              if (isNaN(value) || value < 1) handleWeekChange(1);
              else if (value > 53) handleWeekChange(53);
            }}
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
              onChange={e => handleMonthChange(Number(e.target.value) || 1)}
              onBlur={e => {
                const value = Number(e.target.value);
                if (isNaN(value) || value < 1) handleMonthChange(1);
                else if (value > 12) handleMonthChange(12);
              }}
              style={{ maxWidth: "55px" }}
              placeholder="Month"
            />
            <input
              className={Styles.filterInputs}
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
              style={{ maxWidth: "46px" }}
              placeholder="Day"
            />
          </>
        )}
      </div>

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
            {stats.bestTrade ? `₹${stats.bestTrade.pnl_amount?.toLocaleString()}` : "-"}
          </span>
        </div>
        <div className={Styles.statCard}>
          <span className={Styles.statLabel}>Worst Trade</span>
          <span className={Styles.statValue} style={{color:'var(--dashboard-red-color)'}}>
            {stats.worstTrade ? `₹${stats.worstTrade.pnl_amount?.toLocaleString()}` : "-"}
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

      {loading && <div style={{ fontSize: 18, marginLeft: 10, marginTop: 20 }}>Loading dashboard...</div>}
      {(!trades || trades.length === 0) && !loading && (
        <div style={{ fontSize: 18, marginLeft: 10, marginTop: 20 }}>No trades found for this period.</div>
      )}
    </div>
  );
};

export default Dashboard;
