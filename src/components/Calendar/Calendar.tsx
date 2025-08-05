import { useMemo, useState } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./Calendar.module.css";
import StatCard from "../StatCard/StatCard";
import TradePopup from "../TradePopup/TradePopup";
import type { Trade } from '../../context/TradeContext';

const now = new Date();

const getMonthMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay(); // 0=Sunday
  const totalDays = lastDay.getDate();
  const calendar: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= totalDays; d++) {
    week.push(d);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendar.push(week);
  }
  return calendar;
};

const formatRR = (trades: Trade[]) => {
  // Placeholder: Replace with real R:R calc if available
  return trades.length ? (1 + Math.random() * 2).toFixed(2) : "–";
};

const Calendar = () => {
  // --- STORE MONTH AND YEAR TOGETHER ---
  const [monthYear, setMonthYear] = useState({ month: now.getMonth(), year: now.getFullYear() });
  const [selectedDay, setSelectedDay] = useState<null | number>(null);
  const { trades } = useTrades();

  // Calendar
  const matrix = useMemo(() => getMonthMatrix(monthYear.year, monthYear.month), [monthYear]);
  const monthTrades = useMemo(
    () =>
      (trades ?? []).filter(trade => {
        const td = new Date(trade.date);
        return td.getFullYear() === monthYear.year && td.getMonth() === monthYear.month;
      }),
    [trades, monthYear]
  );
  const tradeByDay = useMemo(() => {
    const map: Record<number, Trade[]> = {};
    for (const trade of monthTrades) {
      const d = new Date(trade.date).getDate();
      if (!map[d]) map[d] = [];
      map[d].push(trade);
    }
    return map;
  }, [monthTrades]);
  const totalPnl = useMemo(
    () =>
      monthTrades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0),
    [monthTrades]
  );
  const totalTrades = monthTrades.length;
  const winTrades = monthTrades.filter(t => (t.pnl_amount ?? 0) > 0).length;
  const winRate = totalTrades ? (winTrades / totalTrades) * 100 : 0;
  const avgRR = formatRR(monthTrades);

  // --- MONTH SWITCH HANDLERS ---
  const handlePrevMonth = () => {
    setMonthYear(({ month, year }) =>
      month === 0
        ? { month: 11, year: year - 1 }
        : { month: month - 1, year }
    );
  };
  const handleNextMonth = () => {
    setMonthYear(({ month, year }) =>
      month === 11
        ? { month: 0, year: year + 1 }
        : { month: month + 1, year }
    );
  };

  return (
    <div className={Styles.calendarPage}>
      {/* Top Stat cards */}
      <div className={Styles.statCardsRow}>
        <StatCard label="TOTAL P&L" value={totalPnl >= 0 ? `+₹${totalPnl.toLocaleString()}` : `₹${totalPnl.toLocaleString()}`} positive={totalPnl >= 0} />
        <StatCard label="WIN RATE" value={`${winRate.toFixed(0)}%`} positive={winRate >= 50} />
        <StatCard label="TOTAL TRADES" value={totalTrades} positive={totalTrades > 0} />
        <StatCard label="AVG. R:R" value={avgRR} positive={Number(avgRR) >= 1} />
      </div>

      {/* Month Selector */}
      <div className={Styles.monthSwitcherRow}>
        <button className={Styles.monthBtn} onClick={handlePrevMonth}>&lt;</button>
        <div className={Styles.monthDisplay}>
          {new Date(monthYear.year, monthYear.month, 1).toLocaleString('default', { month: 'long' })} {monthYear.year}
        </div>
        <button className={Styles.monthBtn} onClick={handleNextMonth}>&gt;</button>
      </div>

      {/* Calendar */}
      <div className={Styles.calendarGrid}>
        <div className={Styles.calendarWeekHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(wd =>
            <div key={wd} className={Styles.calendarWeekday}>{wd}</div>
          )}
        </div>
        {matrix.map((week, widx) => (
          <div key={widx} className={Styles.calendarWeek}>
            {week.map((day, didx) => {
              const tradesForDay = day ? tradeByDay[day] : undefined;
              let status = "";
              if (tradesForDay && tradesForDay.length) {
                const tPnl = tradesForDay.reduce((sum, t) => sum + (t.pnl_amount || 0), 0);
                if (tPnl > 0) status = Styles.positiveDay;
                if (tPnl < 0) status = Styles.negativeDay;
                if (tPnl === 0) status = Styles.neutralDay;
              }
              return (
                <div
                  key={didx}
                  className={`${Styles.calendarDay} ${status} ${selectedDay === day ? Styles.selectedDay : ""} `}
                  onClick={() => day && tradeByDay[day] ? setSelectedDay(day) : undefined}
                >
                  {day && (
                    <>
                      <span>
                        {day}
                        {tradesForDay && tradesForDay.length > 0 && (
                          <div>
                            <span className={Styles.dayPnl}>
                              {tradesForDay.reduce((sum, t) => sum + (t.pnl_amount || 0), 0) > 0 ? "+" : ""}
                              ₹{tradesForDay.reduce((sum, t) => sum + (t.pnl_amount || 0), 0).toLocaleString()}
                            </span>
                            <br />
                            <span className={Styles.dayTradeCount}>
                              {tradesForDay.length} trade{tradesForDay.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Popup for active day */}
      {selectedDay && tradeByDay[selectedDay] && (
        <TradePopup
          date={new Date(monthYear.year, monthYear.month, selectedDay)}
          trades={tradeByDay[selectedDay]}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default Calendar;
