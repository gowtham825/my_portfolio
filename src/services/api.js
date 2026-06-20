import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ─── Equity (Stocks) ───────────────────────────────────────────────
export const fetchHoldings = async () => {
  const res = await api.get('/api/holdings');
  return res.data;
};

export const fetchPositions = async () => {
  const res = await api.get('/api/positions');
  return res.data;
};

export const fetchEquitySummary = async () => {
  const res = await api.get('/api/equity/summary');
  return res.data;
};

// ─── Mutual Funds ──────────────────────────────────────────────────
export const fetchMFHoldings = async () => {
  const res = await api.get('/api/mf/holdings');
  return res.data;
};

export const fetchMFSummary = async () => {
  const res = await api.get('/api/mf/summary');
  return res.data;
};

// ─── Overall Portfolio ─────────────────────────────────────────────
export const fetchPortfolioSummary = async () => {
  const res = await api.get('/api/portfolio/summary');
  return res.data;
};