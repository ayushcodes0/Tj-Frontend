import { useMemo } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./psychology.module.css";

const Psychology = () => {
  const { trades } = useTrades();

  // Calculate stats (same as before)
  const stats = useMemo(() => {
    if (!trades || !trades.length) {
      return null;
    }
    // Confidence levels
    const confidenceArr = trades
      .map(t => t.psychology?.entry_confidence_level)
      .filter((n): n is number => typeof n === "number" && !isNaN(n));
    const avgConfidence = confidenceArr.length
      ? confidenceArr.reduce((a, b) => a + b, 0) / confidenceArr.length
      : null;

    // Satisfaction
    const satisfactionArr = trades
      .map(t => t.psychology?.satisfaction_rating)
      .filter((n): n is number => typeof n === "number" && !isNaN(n));
    const avgSatisfaction = satisfactionArr.length
      ? satisfactionArr.reduce((a, b) => a + b, 0) / satisfactionArr.length
      : null;

    // Emotional states
    const emotionMap: Record<string, number> = {};
    trades.forEach(t => {
      const name = t.psychology?.emotional_state?.name;
      if (name) {
        emotionMap[name] = (emotionMap[name] ?? 0) + 1;
      }
    });
    const topEmotions = Object.entries(emotionMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Mistakes
    const mistakeMap: Record<string, number> = {};
    trades.forEach(t => {
      t.psychology?.mistakes_made?.forEach(m => {
        mistakeMap[m] = (mistakeMap[m] ?? 0) + 1;
      });
    });
    const sortedMistakes = Object.entries(mistakeMap).sort((a, b) => b[1] - a[1]);
    const topMistake = sortedMistakes[0]?.[0] ?? null;

    // Lessons
    const lessonsFreq: Record<string, number> = {};
    trades.forEach(t => {
      const lesson = t.psychology?.lessons_learned?.trim();
      if (lesson) lessonsFreq[lesson] = (lessonsFreq[lesson] ?? 0) + 1;
    });
    const lessonsSorted = Object.entries(lessonsFreq).sort((a, b) => b[1] - a[1]);
    const mostCommonLesson = lessonsSorted[0]?.[0] ?? null;

    // How often mistakes were made: trades with mistakes vs total
    const mistakeCount = trades.filter(t => t.psychology?.mistakes_made?.length).length;

    // How many trades have an emotional state marked
    const emotionCount = Object.values(emotionMap).reduce((a, b) => a + b, 0);

    return {
      avgConfidence,
      confidenceCount: confidenceArr.length,
      avgSatisfaction,
      satisfactionCount: satisfactionArr.length,
      emotionMap,
      topEmotions,
      mistakeMap,
      sortedMistakes,
      topMistake,
      lessonsSorted,
      mostCommonLesson,
      mistakeCount,
      emotionCount,
      total: trades.length,
    };
  }, [trades]);

  if (!stats) return (
    <div className={Styles.performancePage}>
      <h1 className={Styles.pageTitle}>Psychology</h1>
      <div className={Styles.emptyState}>No psychology data found for this period.</div>
    </div>
  );

  return (
    <div className={Styles.performancePage}>
      <h1 className={Styles.pageTitle}>Psychology</h1>
      
      <div className={Styles.cardGrid}>
        {/* Confidence Card */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Confidence & Satisfaction</h3>
          </div>
          <div className={Styles.cardBody}>
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Avg Confidence</span>
                <span className={`${Styles.statValue} ${Styles.positive}`}>
                  {stats.avgConfidence !== null ? stats.avgConfidence.toFixed(2) : "--"}
                  <span className={Styles.unit}> / 10</span>
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Rated Trades</span>
                <span className={Styles.statValue}>{stats.confidenceCount}</span>
              </div>
            </div>
            
            <div className={Styles.statRow}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Avg Satisfaction</span>
                <span className={Styles.statValue}>
                  {stats.avgSatisfaction !== null ? stats.avgSatisfaction.toFixed(2) : "--"}
                  <span className={Styles.unit}> / 10</span>
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Satisfaction Ratings</span>
                <span className={Styles.statValue}>{stats.satisfactionCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emotions Card */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Emotional States</h3>
          </div>
          <div className={Styles.cardBody}>
            {stats.topEmotions.length > 0 ? (
              <>
                <div className={Styles.statRow}>
                  <div className={Styles.statItem}>
                    <span className={Styles.statLabel}>Most Common</span>
                    <span className={Styles.statValue}>{stats.topEmotions[0]?.[0] ?? "--"}</span>
                  </div>
                  <div className={Styles.statItem}>
                    <span className={Styles.statLabel}>Frequency</span>
                    <span className={Styles.statValue}>{stats.topEmotions[0]?.[1] ?? "--"}</span>
                  </div>
                </div>
                
                <div className={Styles.statRow}>
                  <div className={Styles.statItem}>
                    <span className={Styles.statLabel}>Total Emotions Recorded</span>
                    <span className={Styles.statValue}>{stats.emotionCount}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className={Styles.emptyState}>No emotion data recorded</div>
            )}
          </div>
        </div>

        {/* Mistakes Card */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Mistakes Analysis</h3>
          </div>
          <div className={Styles.cardBody}>
            {stats.sortedMistakes.length > 0 ? (
              <>
                <div className={Styles.statRow}>
                  <div className={Styles.statItem}>
                    <span className={Styles.statLabel}>Most Common Mistake</span>
                    <span className={`${Styles.statValue} ${Styles.negative}`}>
                      {stats.topMistake ?? "--"}
                    </span>
                  </div>
                  <div className={Styles.statItem}>
                    <span className={Styles.statLabel}>Trades with Mistakes</span>
                    <span className={Styles.statValue}>
                      {stats.total ? ((stats.mistakeCount / stats.total) * 100).toFixed(1) : "--"}%
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className={Styles.emptyState}>No mistake data recorded</div>
            )}
          </div>
        </div>

        {/* Top Mistakes Card */}
        <div className={`${Styles.card} ${Styles.wideCard}`}>
          <div className={Styles.cardHeader}>
            <h3>Frequent Mistakes</h3>
          </div>
          <div className={Styles.cardBody}>
            {stats.sortedMistakes.length > 0 ? (
              <div className={Styles.tableContainer}>
                <table className={Styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Mistake</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.sortedMistakes.slice(0, 5).map(([mistake, count]) => (
                      <tr key={mistake}>
                        <td>{mistake}</td>
                        <td>{count}</td>
                        <td>{((count / stats.mistakeCount) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={Styles.emptyState}>No mistake data recorded</div>
            )}
          </div>
        </div>

        {/* Lessons Learned Card */}
        <div className={`${Styles.card} ${Styles.wideCard}`}>
          <div className={Styles.cardHeader}>
            <h3>Lessons Learned</h3>
          </div>
          <div className={Styles.cardBody}>
            {stats.lessonsSorted.length > 0 ? (
              <div className={Styles.tableContainer}>
                <table className={Styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Lesson</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lessonsSorted.slice(0, 5).map(([lesson, count]) => (
                      <tr key={lesson}>
                        <td>{lesson}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={Styles.emptyState}>No lesson data recorded</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Psychology;