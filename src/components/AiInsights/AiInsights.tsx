import React, { useState, useEffect, useCallback } from 'react';
import { useTrades } from '../../hooks/useTrade';
import Styles from './AiInsights.module.css';
import { FaTrophy, FaChartLine, FaExclamationTriangle, FaLightbulb, FaCheckCircle, FaTimesCircle, FaBrain } from 'react-icons/fa';


interface KeyMetric { 
  metric: string;
  value: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}
interface AnalysisData {
  performanceSummary: string;
  confidenceLevel: number;
  keyMetrics: KeyMetric[];
  strengths: string[];
  weaknesses: string[];
  actionableAdvice: string[];
}


const LoadingAnimation = () => (
  <div className={Styles.loaderContainer}>
    <div className={Styles.loader}></div>
    <p>The AI is analyzing your trades... This may take a moment.</p>
  </div>
);


const AnalysisSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className={Styles.resultCard}>
        <h3 className={Styles.cardHeader}>{icon}{title}</h3>
        <div className={Styles.cardContent}>
            {children}
        </div>
    </div>
);


const AiInsights = () => {
  const { trades, loading: tradesLoading, fetchTrades } = useTrades();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState('');
  const [analysisPeriod, setAnalysisPeriod] = useState(30);


  const memoizedFetchTrades = useCallback(() => {
    fetchTrades('lifetime', { limit: 10000 });
  }, [fetchTrades]);
  
  useEffect(() => {
    memoizedFetchTrades();
  }, [memoizedFetchTrades]);


  const handleAnalyze = async () => {
    if (!trades) {
      setError("Trade data is not available yet. Please wait.");
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysisResult(null);

    let filteredTrades;
    
    if (analysisPeriod === 0) { // lifetime option
      filteredTrades = trades;
    } else {
      const periodStartDate = new Date();
      periodStartDate.setDate(periodStartDate.getDate() - analysisPeriod);
      filteredTrades = trades.filter(trade => new Date(trade.date) >= periodStartDate);
    }
    
    if (filteredTrades.length === 0) {
      setError(analysisPeriod === 0 ? 'No trades were found.' : `No trades were found in the last ${analysisPeriod} days.`);
      setIsLoading(false);
      return;
    }


    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades: filteredTrades }),
      }); 
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get analysis.');
      }
      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };


  if (tradesLoading && !trades) {
    return <div className={Styles.pageLoader}>Loading your trade history...</div>;
  }


  return (
    <div className={Styles.container}>
      <header className={Styles.header}>
        <h1>AI Insights</h1>
        <p>Your personal trading performance analyst, powered by AI</p>
      </header>
      
      <div className={Styles.controlBox}>
        <div className={Styles.periodSelector}>
          <span className={Styles.periodLabel}>Analysis Period:</span>
          {[
            { value: 7, label: 'Last 7 Days' },
            { value: 30, label: 'Last 30 Days' },
            { value: 60, label: 'Last 60 Days' },
            { value: 0, label: 'Lifetime' }
          ].map(period => (
            <button
              key={period.value}
              className={`${Styles.periodButton} ${analysisPeriod === period.value ? Styles.active : ''}`}
              onClick={() => setAnalysisPeriod(period.value)}
            >
              {period.label}
            </button>
          ))}
        </div>
        <button className={Styles.analyzeButton} onClick={handleAnalyze} disabled={isLoading || tradesLoading}>
          {isLoading ? 'Analyzing...' : <><FaBrain /> Generate Analysis</>}
        </button>
      </div>


      <div className={Styles.resultArea}>
        {isLoading && <LoadingAnimation />}
        {error && <div className={Styles.error}><FaExclamationTriangle /> {error}</div>}
        
        {analysisResult && (
          <div className={Styles.resultsContainer}>
            <AnalysisSection icon={<FaChartLine />} title="Performance">
                <p>{analysisResult.performanceSummary}</p>
                <div className={Styles.confidenceContainer}>
                    <span>Confidence Level</span>
                    <div className={Styles.confidenceBar}>
                        <div className={Styles.confidenceFill} style={{ width: `${analysisResult.confidenceLevel * 10}%` }} />
                    </div>
                    <span>{analysisResult.confidenceLevel.toFixed(1)} / 10</span>
                </div>
            </AnalysisSection>


            <AnalysisSection icon={<FaTrophy />} title="Key Metrics">
                <div className={Styles.metricsGrid}>
                    {analysisResult.keyMetrics.map(item => (
                        <div key={item.metric} className={Styles.metricItem}>
                            <span className={Styles.metricLabel}>{item.metric}</span>
                            <span className={`${Styles.metricValue} ${Styles[item.sentiment]}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </AnalysisSection>


            <AnalysisSection icon={<FaCheckCircle className={Styles.positiveIcon} />} title="Strengths">
                <ul className={Styles.list}>
                    {analysisResult.strengths.map((item, index) => <li key={index} className={Styles.strengthItem}>{item}</li>)}
                </ul>
            </AnalysisSection>


            <AnalysisSection icon={<FaTimesCircle className={Styles.negativeIcon} />} title="Areas for Improvement">
                <ul className={Styles.list}>
                    {analysisResult.weaknesses.map((item, index) => <li key={index} className={Styles.weaknessItem}>{item}</li>)}
                </ul>
            </AnalysisSection>


            <AnalysisSection icon={<FaLightbulb className={Styles.adviceIcon} />} title="Actionable Advice">
                <ul className={Styles.list}>
                    {analysisResult.actionableAdvice.map((item, index) => <li key={index} className={Styles.adviceItem}>{item}</li>)}
                </ul>
            </AnalysisSection>
          </div>
        )}
      </div>
    </div>
  );
};


export default AiInsights;
