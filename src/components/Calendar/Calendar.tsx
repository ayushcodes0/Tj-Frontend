import { useEffect, useMemo, useState } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./Calendar.module.css";
import StatCard from "../StatCard/StatCard";
import TradePopup from "../TradePopup/TradePopup";
import type { Trade } from "../../context/TradeContext";

const now = new Date();

const getMonthMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay(); 
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

// Corrected function to compute average Risk:Reward ratio
function computeAvgRR(trades: Trade[]): number | null {
  const validRatios = trades
    .map(t => {
      // Ensure all necessary data points exist and are numbers
      if (t.entry_price !== undefined && t.exit_price !== undefined && t.stop_loss !== undefined) {
        const risk = Math.abs(t.entry_price - t.stop_loss);
        const reward = Math.abs(t.exit_price - t.entry_price);
        return risk > 0 ? reward / risk : Infinity; // Return Infinity for zero risk
      }
      return null;
    })
    .filter((rr): rr is number => typeof rr === "number" && isFinite(rr)); // Filter out nulls and infinite values

  if (!validRatios.length) return null;
  
  const sum = validRatios.reduce((a, b) => a + b, 0);
  return sum / validRatios.length;
}

function calcDelta(current: number, prev: number) {
  if (prev === 0) return current === 0 ? 0 : 100;
  return ((current - prev) / Math.abs(prev)) * 100;
}

const Calendar = () => {
  const [monthYear, setMonthYear] = useState({ month: now.getMonth(), year: now.getFullYear() });
  const [selectedDay, setSelectedDay] = useState<null | number>(null);
  const { trades, fetchTrades } = useTrades();

  // Fetch all trades once when the component mounts
  useEffect(() => {
    fetchTrades("lifetime");
  }, [fetchTrades]);

  const matrix = useMemo(() => getMonthMatrix(monthYear.year, monthYear.month), [monthYear]);
  
  const monthTrades = useMemo(
    () =>
      (trades ?? []).filter(trade => {
        const td = new Date(trade.date);
        return td.getFullYear() === monthYear.year && td.getMonth() === monthYear.month;
      }),
    [trades, monthYear]
  );
  
  const prevMonth = monthYear.month === 0 ? 11 : monthYear.month - 1;
  const prevYear = monthYear.month === 0 ? monthYear.year - 1 : monthYear.year;
  const prevMonthTrades = useMemo(
    () =>
      (trades ?? []).filter(trade => {
        const td = new Date(trade.date);
        return td.getFullYear() === prevYear && td.getMonth() === prevMonth;
      }),
    [trades, prevYear, prevMonth]
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

  const totalPnl = monthTrades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0);
  const totalTrades = monthTrades.length;
  const winTrades = monthTrades.filter(t => (t.pnl_amount ?? 0) > 0).length;
  const winRate = totalTrades ? (winTrades / totalTrades) * 100 : 0;
  const avgRR = computeAvgRR(monthTrades);

  const prevTotalPnl = prevMonthTrades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0);
  const prevTotalTrades = prevMonthTrades.length;
  const prevWinTrades = prevMonthTrades.filter(t => (t.pnl_amount ?? 0) > 0).length;
  const prevWinRate = prevTotalTrades ? (prevWinTrades / prevTotalTrades) * 100 : 0;
  const prevAvgRR = computeAvgRR(prevMonthTrades);

  const deltaTotalPnl = calcDelta(totalPnl, prevTotalPnl);
  const deltaWinRate = calcDelta(winRate, prevWinRate);
  const deltaTotalTrades = calcDelta(totalTrades, prevTotalTrades);
  const deltaRR = calcDelta(avgRR ?? 0, prevAvgRR ?? 0);

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
      <div className={Styles.statCardsRow}>
        <StatCard
          label="TOTAL P&L"
          value={totalPnl >= 0 ? `+₹${totalPnl.toLocaleString()}` : `₹${totalPnl.toLocaleString()}`}
          positive={totalPnl >= 0}
          delta={deltaTotalPnl}
        />
        <StatCard
          label="WIN RATE"
          value={`${winRate.toFixed(0)}%`}
          positive={winRate >= 50}
          delta={deltaWinRate}
        />
        <StatCard
          label="TOTAL TRADES"
          value={totalTrades}
          positive={totalTrades > 0}
          delta={deltaTotalTrades}
        />
        <StatCard
          label="AVG. R:R"
          value={avgRR !== null ? avgRR.toFixed(2) : "–"}
          positive={avgRR !== null && avgRR >= 1}
          delta={deltaRR}
        />
      </div>

      <div className={Styles.monthSwitcherRow}>
        <button className={Styles.monthBtn} onClick={handlePrevMonth}>&lt;</button>
        <div className={Styles.monthDisplay}>
          {new Date(monthYear.year, monthYear.month, 1).toLocaleString('default', { month: 'long' })} {monthYear.year}
        </div>
        <button className={Styles.monthBtn} onClick={handleNextMonth}>&gt;</button>
      </div>

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