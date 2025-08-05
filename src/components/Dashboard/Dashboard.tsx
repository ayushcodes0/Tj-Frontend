import { useEffect, useMemo, useState } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./Dashboard.module.css";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

// Filters
const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;

const FILTERS = [
  { label: 'Last Month', value: 'month' as const },
  { label: 'This Year', value: 'year' as const },
  { label: 'Lifetime', value: 'lifetime' as const },
  { label: 'Specific Day', value: 'day' as const },
];

const COLORS = ["#66d7b0", "#c080fa", "#ffcc7d", "#ff6f91", "#437de8", "#2dd7ef", "#ffa500", "#e44b43", "#67b7dc", "#a683e3"];

function formatDateLabel(date: string) {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

const Dashboard = () => {
  const { trades, loading, fetchTrades } = useTrades();
  const [filter, setFilter] = useState<'lifetime' | 'month' | 'year' | 'day'>('month');
  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());
  const [day, setDay] = useState(new Date().getDate());

  // loading data on mount and on filter change
  useEffect(() => {
    if (filter === "lifetime") {
      fetchTrades("lifetime", {});
    } else if (filter === "year") {
      fetchTrades("year", { year });
    } else if (filter === "month") {
      fetchTrades("month", { year, month });
    } else if (filter === "day") {
      fetchTrades("day", { year, month, day });
    }
  }, [filter, year, month, day, fetchTrades]);

  // for memoization
  const stats = useMemo(() => {
    if (!trades) return null;
    const totalTrades = trades.length;
    const winTrades = trades.filter(t => (t.pnl_amount ?? 0) > 0);
    const lossTrades = trades.filter(t => (t.pnl_amount ?? 0) < 0);
    const breakEvenTrades = trades.filter(t => (t.pnl_amount ?? 0) === 0);
    const grossPnl = trades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0);
    const avgPnl = totalTrades ? grossPnl / totalTrades : 0;
    const winRate = totalTrades ? (winTrades.length / totalTrades) * 100 : 0;
    const bestTrade = trades.reduce((a, b) => ((a?.pnl_amount ?? -Infinity) > (b?.pnl_amount ?? -Infinity) ? a : b), null as typeof trades[0] | null);
    const worstTrade = trades.reduce((a, b) => ((a?.pnl_amount ?? Infinity) < (b?.pnl_amount ?? Infinity) ? a : b), null as typeof trades[0] | null);

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

  // PnL Timeline for LineChart
  const timelineData = useMemo(() => {
    if (!trades) return [];
    // Group by date (daily PnL):
    const daily: Record<string, number> = {};
    for (const t of trades) {
      const dt = t.date.slice(0, 10); // yyyy-mm-dd
      daily[dt] = (daily[dt] ?? 0) + (t.pnl_amount ?? 0);
    }
    return Object.entries(daily)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, pnl]) => ({ date: formatDateLabel(date), pnl }));
  }, [trades]);

  // Win-Loss Pie
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

  // Strategy Frequency Bar
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

  // Mistake frequency
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
          onChange={e => setFilter(e.target.value as 'lifetime' | 'month' | 'year' | 'day')}
        >
          {FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        {(filter === "year" || filter === "month" || filter === "day") && (
          <input
            className={Styles.filterInputs}
            type="number"
            min={2000}
            max={2100}
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            style={{ maxWidth: "80px" }}
            placeholder="Year"
          />
        )}
        {(filter === "month" || filter === "day") && (
          <input
            className={Styles.filterInputs}
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            style={{ maxWidth: "55px" }}
            placeholder="Month"
          />
        )}
        {filter === "day" && (
          <input
            className={Styles.filterInputs}
            type="number"
            min={1}
            max={31}
            value={day}
            onChange={e => setDay(Number(e.target.value))}
            style={{ maxWidth: "46px" }}
            placeholder="Day"
          />
        )}
      </div>

      {/* Stat Cards */}
      {stats && <div className={Styles.dashboardStatsCards}>
        <div className={Styles.statCard}>
          <span className={Styles.statLabel}>Gross P&L (₹)</span>
          <span className={Styles.statValue} style={{color: stats.grossPnl >= 0 ? '#2dbe6d' : '#e44b43'}}>
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
          <span className={Styles.statValue} style={{color:'#2dbe6d', fontSize:18}}>
            {stats.bestTrade ? `₹${stats.bestTrade.pnl_amount?.toLocaleString()}` : "-"}
          </span>
        </div>
        <div className={Styles.statCard}>
          <span className={Styles.statLabel}>Worst Trade</span>
          <span className={Styles.statValue} style={{color:'#e44b43', fontSize:18}}>
            {stats.worstTrade ? `₹${stats.worstTrade.pnl_amount?.toLocaleString()}` : "-"}
          </span>
        </div>
      </div>}

      {/* Charts */}
      <div className={Styles.dashboardCharts}>
        <div className={Styles.chartBox}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>P&L Over Time</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="2 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pnl" stroke="#6366f1" strokeWidth={3} name="P&L" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={Styles.chartBox}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Win/Loss Ratio</div>
          <ResponsiveContainer height={220} width="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={64}>
                {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend verticalAlign="bottom" align="center" iconType="circle" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={Styles.chartBox}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Strategy Usage</div>
          <ResponsiveContainer height={220} width="100%">
            <BarChart data={strategyData}>
              <CartesianGrid strokeDasharray="2 5" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="count" fill="#7c48e7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={Styles.chartBox}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Trading Mistakes</div>
          <ResponsiveContainer height={220} width="100%">
            <BarChart data={mistakeData}>
              <CartesianGrid strokeDasharray="2 5" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="value" fill="#e55f3c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {loading && <div style={{ fontSize: 18, marginLeft: 10, marginTop: 20 }}>Loading dashboard...</div>}
      {(!trades || trades.length === 0) && !loading && (
        <div style={{ fontSize: 18, marginLeft: 10, marginTop: 20 }}>No trades found for this period.</div>
      )}
    </div>
  );
};

export default Dashboard;
