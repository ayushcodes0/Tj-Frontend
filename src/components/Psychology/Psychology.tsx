import { useMemo } from "react";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./psychology.module.css";

const Psychology = () => {
  const { trades } = useTrades();

  const stats = useMemo(() => {
    if (!trades || !trades.length) return null;

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
    const mostCommonEmotion = topEmotions[0]?.[0] ?? null;
    const emotionCount = Object.values(emotionMap).reduce((a, b) => a + b, 0);

    // Mistakes
    const mistakeMap: Record<string, number> = {};
    trades.forEach(t => {
      t.psychology?.mistakes_made?.forEach(m => {
        mistakeMap[m] = (mistakeMap[m] ?? 0) + 1;
      });
    });
    const sortedMistakes = Object.entries(mistakeMap).sort((a, b) => b[1] - a[1]);
    const topMistake = sortedMistakes[0]?.[0] ?? null;
    const mistakeCount = trades.filter(t => t.psychology?.mistakes_made?.length).length;
    const mistakePercent = trades.length ? (mistakeCount / trades.length) * 100 : 0;

    // Lessons
    const lessonsFreq: Record<string, number> = {};
    trades.forEach(t => {
      const lesson = t.psychology?.lessons_learned?.trim();
      if (lesson) lessonsFreq[lesson] = (lessonsFreq[lesson] ?? 0) + 1;
    });
    const lessonsSorted = Object.entries(lessonsFreq).sort((a, b) => b[1] - a[1]);
    const mostCommonLesson = lessonsSorted[0]?.[0] ?? null;

    return {
      avgConfidence,
      confidenceCount: confidenceArr.length,
      avgSatisfaction,
      satisfactionCount: satisfactionArr.length,
      mostCommonEmotion,
      emotionCount,
      emotionPercent: trades.length ? (emotionCount / trades.length) * 100 : 0,
      topMistake,
      mistakeCount,
      mistakePercent,
      mostCommonLesson,
      sortedMistakes,
      lessonsSorted,
      topEmotions,
      total: trades.length,
    };
  }, [trades]);

  if (!stats) {
    return (
      <div className={Styles.dashboard}>
        <h1 className={Styles.title}>Trading Psychology</h1>
        <div className={Styles.emptyState}>No psychology data found for this period.</div>
      </div>
    );
  }

  return (
    <div className={Styles.dashboard}>
      <header className={Styles.header}>
        <h1 className={Styles.title}>Trading Psychology</h1>
        <div className={Styles.summaryCards}>
          <div className={`${Styles.summaryCard} ${Styles.primaryCard}`}>
            <div className={Styles.summaryLabel}>Avg Confidence</div>
            <div className={Styles.summaryValue}>
              {stats.avgConfidence !== null ? stats.avgConfidence.toFixed(1) : "--"}
              <span className={Styles.unit}> / 10</span>
            </div>
          </div>
          <div className={`${Styles.summaryCard} ${stats.mistakePercent > 50 ? Styles.dangerCard : Styles.successCard}`}>
            <div className={Styles.summaryLabel}>Trades with Mistakes</div>
            <div className={Styles.summaryValue}>{stats.mistakeCount}</div>
          </div>
          <div className={`${Styles.summaryCard} ${Styles.primaryCard}`}>
            <div className={Styles.summaryLabel}>Avg Satisfaction</div>
            <div className={Styles.summaryValue}>
              {stats.avgSatisfaction !== null ? stats.avgSatisfaction.toFixed(1) : "--"}
              <span className={Styles.unit}> / 10</span>
            </div>
          </div>
        </div>
      </header>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Emotional Metrics</h2>
        <div className={Styles.metricsGrid}>
          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Confidence & Satisfaction</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Confidence</span>
                  <span className={`${Styles.metricValue} ${stats.avgConfidence && stats.avgConfidence >= 7 ? Styles.positive : Styles.neutral}`}>
                    {stats.avgConfidence !== null ? stats.avgConfidence.toFixed(2) : "--"}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Rated Trades</span>
                  <span className={Styles.metricValue}>{stats.confidenceCount}</span>
                </div>
              </div>
              
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Average Satisfaction</span>
                  <span className={`${Styles.metricValue} ${stats.avgSatisfaction && stats.avgSatisfaction >= 7 ? Styles.positive : Styles.neutral}`}>
                    {stats.avgSatisfaction !== null ? stats.avgSatisfaction.toFixed(2) : "--"}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Rated Trades</span>
                  <span className={Styles.metricValue}>{stats.satisfactionCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Emotional States</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Most Common Emotion</span>
                  <span className={Styles.metricValue}>
                    {stats.mostCommonEmotion ?? "--"}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Emotions Recorded</span>
                  <span className={Styles.metricValue}>{stats.emotionCount}</span>
                </div>
              </div>
              
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Top 3 Emotions</span>
                  <div className={Styles.tagContainer}>
                    {stats.topEmotions.map(([emotion, count]) => (
                      <span key={emotion} className={Styles.tag}>
                        {emotion} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Mistakes Analysis</h2>
        <div className={Styles.metricsGrid}>
          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Mistake Frequency</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Most Common Mistake</span>
                  <span className={`${Styles.metricValue} ${Styles.negative}`}>
                    {stats.topMistake ?? "--"}
                  </span>
                </div>
                <div className={Styles.metricItem}>
                  <span className={Styles.metricLabel}>Trades with Mistakes</span>
                  <span className={`${Styles.metricValue} ${stats.mistakePercent > 50 ? Styles.negative : Styles.neutral}`}>
                    {stats.mistakePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.metricCard}>
            <div className={Styles.metricHeader}>
              <h3>Mistake Types</h3>
            </div>
            <div className={Styles.metricBody}>
              <div className={Styles.metricRow}>
                <div className={Styles.metricItem}>
                  <span className={Styles.statNote}>
                    Breakdown of most frequent mistakes made during trades
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Frequent Mistakes</h2>
        <div className={Styles.fullWidthCard}>
          <div className={Styles.dataHeader}>
            <h3>Top 5 Mistakes</h3>
          </div>
          <div className={Styles.dataBody}>
            {stats.sortedMistakes.length > 0 ? (
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
            ) : (
              <div className={Styles.emptyState}>No mistake data recorded</div>
            )}
          </div>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Lessons Learned</h2>
        <div className={Styles.fullWidthCard}>
          <div className={Styles.dataHeader}>
            <h3>Most Common Lessons</h3>
          </div>
          <div className={Styles.dataBody}>
            {stats.lessonsSorted.length > 0 ? (
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
            ) : (
              <div className={Styles.emptyState}>No lesson data recorded</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Psychology;