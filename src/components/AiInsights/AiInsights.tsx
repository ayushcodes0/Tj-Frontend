

import  { useState, useEffect } from 'react';
import { useTrades } from '../../hooks/useTrade';
import ReactMarkdown from 'react-markdown';
import Styles from './AiInsights.module.css';

const AiInsights = () => {
  const { trades, loading: tradesLoading, fetchTrades } = useTrades();
  
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState('');
  const [analysisPeriod, setAnalysisPeriod] = useState(30);

  useEffect(() => {
    fetchTrades('lifetime', { limit: 10000 });
  }, [fetchTrades]);

  const handleAnalyze = async () => {
    if (!trades) {
      setError("Trade data is not available yet. Please wait a moment and try again.");
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysisResult('');

    const now = new Date();
    const filteredTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      const diffTime = Math.abs(now.getTime() - tradeDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= analysisPeriod;
    });

    if (filteredTrades.length === 0) {
      setError(`No trades were found in the last ${analysisPeriod} days to analyze.`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trades: filteredTrades }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get analysis from the server.');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);

    } catch (err) { // `err` is correctly typed as 'unknown'
      if (err instanceof Error) {
        // This is the type-safe way to access the error message
        setError(err.message);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (tradesLoading && !trades) {
    return <div className={Styles.loader}>Loading your trade history...</div>;
  }

  return (
    <div className={Styles.container}>
      <header className={Styles.header}>
        <h1>AI Trading Analysis</h1>
        <p>Comprehensive performance insights powered by AI</p>
      </header>

      <div className={Styles.analysisBox}>
        <div className={Styles.generateSection}>
          <div className={Styles.generateText}>
            <h2>Generate AI Summary</h2>
            <p>Analyze your last {analysisPeriod} days of trading performance with advanced AI insights.</p>
          </div>
          <button className={Styles.analyzeButton} onClick={handleAnalyze} disabled={isLoading || tradesLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze My Trading'}
          </button>
        </div>

        <div className={Styles.periodSelector}>
          <span className={Styles.periodLabel}>Analysis Period:</span>
          <button
            className={`${Styles.periodButton} ${analysisPeriod === 30 ? Styles.active : ''}`}
            onClick={() => setAnalysisPeriod(30)}
          >
            Last 30 Days
          </button>
          <button
            className={`${Styles.periodButton} ${analysisPeriod === 60 ? Styles.active : ''}`}
            onClick={() => setAnalysisPeriod(60)}
          >
            Last 60 Days
          </button>
          <button
            className={`${Styles.periodButton} ${analysisPeriod === 90 ? Styles.active : ''}`}
            onClick={() => setAnalysisPeriod(90)}
          >
            Last 90 Days
          </button>
        </div>
      </div>

      <div className={Styles.resultArea}>
        {isLoading && <div className={Styles.loader}>Please wait, the AI is analyzing your trades... This may take a moment.</div>}
        {error && <div className={Styles.error}>{error}</div>}
        {analysisResult && (
          <div className={Styles.resultContainer}>
            <ReactMarkdown>{analysisResult}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInsights;
