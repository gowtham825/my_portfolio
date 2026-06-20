import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SummaryCard from './SummaryCard';
import HoldingRow from './HoldingRow';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const MFSection = ({ holdings = [], summary = {} }) => {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('pnl');
  const [sortDir, setSortDir] = useState('desc');

  const totalInvested = holdings.reduce((s, h) => s + (h.average_price * h.quantity || 0), 0);
  const totalCurrent = holdings.reduce((s, h) => s + (h.last_price * h.quantity || 0), 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const sorted = [...holdings]
    .filter(h => (h.tradingsymbol || h.fund_name || '').toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      let aVal = sortBy === 'pnl' ? (a.pnl || 0) : sortBy === 'value' ? a.last_price * a.quantity : (a.pnl_pct || 0);
      let bVal = sortBy === 'pnl' ? (b.pnl || 0) : sortBy === 'value' ? b.last_price * b.quantity : (b.pnl_pct || 0);
      return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  const barData = holdings
    .map(h => ({
      name: (h.tradingsymbol || h.fund_name || '').slice(0, 12),
      invested: parseFloat((h.average_price * h.quantity).toFixed(0)),
      current: parseFloat((h.last_price * h.quantity).toFixed(0)),
    }))
    .slice(0, 8);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) =>
    sortBy === col
      ? (sortDir === 'asc' ? <FiChevronUp className="sort-icon active" /> : <FiChevronDown className="sort-icon active" />)
      : <FiChevronDown className="sort-icon" />;

  return (
    <section className="section mf-section">
      <div className="section-header">
        <div className="section-title-row">
          <div className="section-dot mf-dot" />
          <h2 className="section-title">Mutual Funds</h2>
          <span className="holdings-count">{holdings.length} funds</span>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard label="Invested" value={totalInvested} />
        <SummaryCard label="Current Value" value={totalCurrent} />
        <SummaryCard
          label="Total Returns"
          value={totalPnL}
          sub={`${totalPnL >= 0 ? '+' : ''}${totalPnLPct.toFixed(2)}%`}
          positive={totalPnL >= 0}
          negative={totalPnL < 0}
        />
        <SummaryCard
          label="XIRR"
          value={summary.xirr != null ? `${summary.xirr?.toFixed(2)}%` : 'N/A'}
          prefix=""
          positive={(summary.xirr || 0) > 0}
        />
      </div>

      {holdings.length > 0 && (
        <div className="chart-row">
          <div className="bar-wrap">
            <p className="chart-label">Invested vs Current Value</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barGap={2}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                <Bar dataKey="invested" fill="#c4b5fd" radius={[3, 3, 0, 0]} name="Invested" />
                <Bar dataKey="current" radius={[3, 3, 0, 0]} name="Current">
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.current >= entry.invested ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="table-controls">
        <input
          className="search-input"
          placeholder="Search funds…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Fund Name</th>
              <th>Units</th>
              <th>Avg NAV</th>
              <th>Curr NAV</th>
              <th onClick={() => handleSort('value')} className="sortable">Value <SortIcon col="value" /></th>
              <th onClick={() => handleSort('pnl')} className="sortable">Returns <SortIcon col="pnl" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={6} className="empty-row">No MF holdings found</td></tr>
            ) : (
              sorted.map((h, i) => <HoldingRow key={i} holding={h} type="mf" />)
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MFSection;