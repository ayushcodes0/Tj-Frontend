// src/components/PerformanceAnalytics/PerformanceAnalytics.tsx
import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Styles from "./PerformanceAnalytics.module.css";

// Change Props to accept unknown[] instead of AnalyticsTrade[]
type Props = {
  trades: unknown[]; // Changed from AnalyticsTrade[] to unknown[]
};

type GroupRow = {
  name: string;
  profit: number;
  loss: number;
  count: number;
  wins: number;
  winRate: number; // 0..100
};

const COLORS = [
  "var(--dashboard-green-color, #1db88a)",
  "var(--dashboard-red-color, #e44b43)",
  "#437de8",
  "#ffcc7d",
  "#ff6f91",
  "#2dd7ef",
  "#a683e3",
  "#ffa500",
  "#67b7dc",
];

const moneyFmt = (v: number | string) => {
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return `₹${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const safeString = (x: unknown, fallback = "Other"): string => {
  if (x == null) return fallback;
  if (typeof x === "string") return x;
  if (typeof x === "number") return String(x);
  if (typeof x === "object") {
    // try common shapes: { name, _id }
    const obj = x as Record<string, unknown>;
    if (typeof obj.name === "string" && obj.name.trim()) return obj.name;
    if (typeof obj._id === "string" && obj._id.trim()) return obj._id;
    return JSON.stringify(obj);
  }
  return String(x);
};

// Helper function to safely extract a property from unknown object
const getProperty = (obj: unknown, property: string): unknown => {
  if (typeof obj === 'object' && obj !== null) {
    return (obj as Record<string, unknown>)[property];
  }
  return undefined;
};

const extractStrategyName = (t: unknown) => {
  const strategy = getProperty(t, 'strategy');
  return safeString(strategy ?? "Other");
};

const extractAssetType = (t: unknown) => {
  const assetType = getProperty(t, 'asset_type');
  return safeString(assetType ?? "Other");
};

const extractTags = (t: unknown) => {
  const tags = getProperty(t, 'tags');
  if (!Array.isArray(tags) || tags.length === 0) return ["Other"];
  return tags.map((item) => safeString(item, "Other"));
};

const extractPnlAmount = (t: unknown): number => {
  const pnl = getProperty(t, 'pnl_amount');
  return typeof pnl === 'number' ? pnl : 0;
};

const groupBy = (trades: unknown[], getter: (t: unknown) => string): GroupRow[] => {
  const map: Record<string, { profit: number; loss: number; count: number; wins: number }> = {};

  for (const t of trades || []) {
    const name = getter(t) || "Other";
    const pnl = extractPnlAmount(t);
    if (!map[name]) map[name] = { profit: 0, loss: 0, count: 0, wins: 0 };

    map[name].count += 1;
    if (pnl > 0) {
      map[name].wins += 1;
      map[name].profit += pnl;
    } else if (pnl < 0) {
      map[name].loss += Math.abs(pnl);
    }
  }

  const out: GroupRow[] = Object.entries(map).map(([name, v]) => ({
    name,
    profit: v.profit,
    loss: v.loss,
    count: v.count,
    wins: v.wins,
    winRate: v.count > 0 ? (v.wins / v.count) * 100 : 0,
  }));

  // Sort by net P&L desc (profit - loss)
  out.sort((a, b) => (b.profit - b.loss) - (a.profit - a.loss));
  return out;
};

const PerformanceAnalytics: React.FC<Props> = ({ trades }) => {
  const [tab, setTab] = useState<"strategies" | "assets" | "tags">("strategies");

  // grouped data
  const strategyData = useMemo(() => groupBy(trades ?? [], extractStrategyName), [trades]);
  const assetData = useMemo(() => groupBy(trades ?? [], extractAssetType), [trades]);
  // tags: a single trade may contribute to multiple tag groups (we count trade once per tag)
  const tagData = useMemo(() => {
    const map: Record<string, { profit: number; loss: number; count: number; wins: number }> = {};
    for (const t of trades ?? []) {
      const pnl = extractPnlAmount(t);
      const tags = extractTags(t);
      for (const tg of tags) {
        const name = tg || "Other";
        if (!map[name]) map[name] = { profit: 0, loss: 0, count: 0, wins: 0 };
        map[name].count++;
        if (pnl > 0) {
          map[name].wins++;
          map[name].profit += pnl;
        } else if (pnl < 0) {
          map[name].loss += Math.abs(pnl);
        }
      }
    }
    const arr: GroupRow[] = Object.entries(map).map(([name, v]) => ({
      name,
      profit: v.profit,
      loss: v.loss,
      count: v.count,
      wins: v.wins,
      winRate: v.count ? (v.wins / v.count) * 100 : 0,
    }));
    arr.sort((a, b) => (b.profit - b.loss) - (a.profit - a.loss));
    return arr;
  }, [trades]);

  const chartData = tab === "strategies" ? strategyData : tab === "assets" ? assetData : tagData;

  // data shapes for recharts
  const barData = chartData.map((r) => ({ name: r.name, profit: r.profit, loss: r.loss }));
  const pieData = chartData.map((r) => ({ name: r.name, value: Number(r.winRate.toFixed(1)), count: r.count, winRate: r.winRate }));

  return (
    <div className={Styles.analyticsWrapper}>
      <div className={Styles.headerRow}>
        <h3 className={Styles.analyticsHeading}>Performance Analytics</h3>

        <div className={Styles.analyticsTabWrapper}>
          <button
            type="button"
            className={`${Styles.analyticsTab} ${tab === "strategies" ? Styles.activeTab : ""}`}
            onClick={() => setTab("strategies")}
          >
            Strategies
          </button>
          <button
            type="button"
            className={`${Styles.analyticsTab} ${tab === "assets" ? Styles.activeTab : ""}`}
            onClick={() => setTab("assets")}
          >
            Assets
          </button>
          <button
            type="button"
            className={`${Styles.analyticsTab} ${tab === "tags" ? Styles.activeTab : ""}`}
            onClick={() => setTab("tags")}
          >
            Tags
          </button>
        </div>
      </div>

      <div className={Styles.analyticsChartsRow}>
        {/* LEFT - P&L horizontal stacked bars */}
        <div className={Styles.analyticsChartBox}>
          <div className={Styles.chartHeading}>P&L by {tab === "strategies" ? "Strategy" : tab === "assets" ? "Asset Type" : "Tag"}</div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v) => moneyFmt(v)} />
                <YAxis type="category" dataKey="name" width={140} />
                <Tooltip formatter={(value: number) => moneyFmt(value)} />
                <Bar dataKey="profit" stackId="a" fill={COLORS[0]} name="Profit" />
                <Bar dataKey="loss" stackId="a" fill={COLORS[1]} name="Loss" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT - Win Rate donut + legend */}
        <div className={Styles.analyticsChartBox}>
          <div className={Styles.chartHeading}>Win Rate by {tab === "strategies" ? "Strategy" : tab === "assets" ? "Asset Type" : "Tag"}</div>

          <div className={Styles.rightInner}>
            <div style={{ flex: "0 0 52%", minWidth: 220, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={56}
                    outerRadius={90}
                    paddingAngle={4}
                    label={(props: { value?: number }) => {
                      const v = props?.value ?? 0;
                      return `${Math.round(Number(v))}%`;
                    }}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={Styles.legendWrapper}>
              <div className={Styles.legendScroll}>
                {chartData.map((it, idx) => (
                  <div className={Styles.legendItem} key={it.name + idx}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className={Styles.colorDot} style={{ background: COLORS[idx % COLORS.length] }} />
                      <div className={Styles.legendName}>{it.name}</div>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div className={Styles.percentBadge}>{Math.round(it.winRate)}%</div>
                      <div className={Styles.countBadge}>{it.count}t</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;