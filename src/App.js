import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import EquitySection from './components/EquitySection';
import MFSection from './components/MFSection';
import SummaryCard from './components/SummaryCard';
import {
  fetchHoldings,
  fetchMFHoldings,
  fetchEquitySummary,
  fetchMFSummary,
} from './services/api';
import './App.css';

// ─── Demo data shown before backend is connected ───────────────────
const DEMO_HOLDINGS = [
  { tradingsymbol: 'RELIANCE', exchange: 'NSE', quantity: 10, average_price: 2400, last_price: 2650, pnl: 2500, pnl_pct: 10.4 },
  { tradingsymbol: 'TCS', exchange: 'NSE', quantity: 5, average_price: 3400, last_price: 3720, pnl: 1600, pnl_pct: 9.4 },
  { tradingsymbol: 'INFY', exchange: 'NSE', quantity: 20, average_price: 1450, last_price: 1390, pnl: -1200, pnl_pct: -4.1 },
  { tradingsymbol: 'HDFC', exchange: 'NSE', quantity: 8, average_price: 1600, last_price: 1750, pnl: 1200, pnl_pct: 9.4 },
  { tradingsymbol: 'WIPRO', exchange: 'NSE', quantity: 30, average_price: 420, last_price: 445, pnl: 750, pnl_pct: 5.9 },
  { tradingsymbol: 'TATAMOTORS', exchange: 'NSE', quantity: 15, average_price: 600, last_price: 575, pnl: -375, pnl_pct: -4.2 },
];

const DEMO_MF = [
  { tradingsymbol: 'MIRAE ASSET LARGE CAP', folio: '1234567', quantity: 150.234, average_price: 80, last_price: 95.4, pnl: 2310, pnl_pct: 19.25 },
  { tradingsymbol: 'AXIS BLUECHIP FUND', folio: '2345678', quantity: 200.5, average_price: 45, last_price: 52.8, pnl: 1565, pnl_pct: 17.3 },
  { tradingsymbol: 'PARAG PARIKH FLEXI CAP', folio: '3456789', quantity: 80.12, average_price: 55, last_price: 68.2, pnl: 1057, pnl_pct: 23.9 },
  { tradingsymbol: 'SBI SMALL CAP', folio: '4567890', quantity: 60.8, average_price: 120, last_price: 108, pnl: -729, pnl_pct: -10.0 },
];

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

function App() {
  const [equityHoldings, setEquityHoldings] = useState(DEMO_HOLDINGS);
  const [mfHoldings, setMfHoldings] = useState(DEMO_MF);
  const [equitySummary, setEquitySummary] = useState({});
  const [mfSummary, setMfSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDemo, setIsDemo] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [holdings, mf, eqSum, mfSum] = await Promise.all([
        fetchHoldings(),
        fetchMFHoldings(),
        fetchEquitySummary().catch(() => ({})),
        fetchMFSummary().catch(() => ({})),
      ]);
      setEquityHoldings(holdings);
      setMfHoldings(mf);
      setEquitySummary(eqSum);
      setMfSummary(mfSum);
      setLastUpdated(Date.now());
      setIsDemo(false);
    } catch (err) {
      console.warn('Backend not connected — showing demo data.', err.message);
      setError('Backend not connected. Showing demo data. Connect your backend to see live data.');
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  // ─── Overall totals ──────────────────────────────────────────────
  const eqInvested = equityHoldings.reduce((s, h) => s + h.average_price * h.quantity, 0);
  const eqCurrent = equityHoldings.reduce((s, h) => s + h.last_price * h.quantity, 0);
  const mfInvested = mfHoldings.reduce((s, h) => s + (h.average_price * h.quantity || 0), 0);
  const mfCurrent = mfHoldings.reduce((s, h) => s + (h.last_price * h.quantity || 0), 0);
  const totalInvested = eqInvested + mfInvested;
  const totalCurrent = eqCurrent + mfCurrent;
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <div className="app">
      <Header onRefresh={loadData} lastUpdated={lastUpdated} loading={loading} />

      {isDemo && (
        <div className="demo-banner">
          ⚡ Demo mode — connect your backend to see live Zerodha data
        </div>
      )}

      {error && !isDemo && (
        <div className="error-banner">{error}</div>
      )}

      <div className="overall-summary">
        <SummaryCard label="Total Invested" value={totalInvested} />
        <SummaryCard label="Portfolio Value" value={totalCurrent} />
        <SummaryCard
          label="Overall P&L"
          value={totalPnL}
          sub={`${totalPnL >= 0 ? '+' : ''}${totalPnLPct.toFixed(2)}%`}
          positive={totalPnL >= 0}
          negative={totalPnL < 0}
        />
        <SummaryCard label="Equity" value={eqCurrent} />
        <SummaryCard label="Mutual Funds" value={mfCurrent} />
      </div>

      <div className="sections-split">
        <EquitySection holdings={equityHoldings} summary={equitySummary} />
        <MFSection holdings={mfHoldings} summary={mfSummary} />
      </div>
    </div>
  );
}

export default App;