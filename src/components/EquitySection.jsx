import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SummaryCard from './SummaryCard';
import HoldingRow from './HoldingRow';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const EquitySection = ({ holdings = [], summary = {} }) => {
  const [sortBy, setSortBy] = useState('pnl');
  const [sortDir, setSortDir] = useState('desc');
  const [filter, setFilter] = useState('');

  const totalInvested = holdings.reduce((s, h) => s + h.average_price * h.quantity, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.last_price * h.quantity, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const sorted = [...holdings]
    .filter(h => h.tradingsymbol?.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'pnl') { aVal = a.pnl || 0; bVal = b.pnl || 0; }
      else if (sortBy === 'value') { aVal = a.last_price * a.quantity; bVal = b.last_price * b.quantity; }
      else if (sortBy === 'name') { aVal = a.tradingsymbol; bVal = b.tradingsymbol; }
      else { aVal = a.pnl_pct || 0; bVal = b.pnl_pct || 0; }
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  const pieData = holdings
    .map(h => ({ name: h.tradingsymbol, value: h.last_price * h.quantity }))
    .sort((a, b) => b.value - a.value)
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
    <section className="section equity-section">
      <div className="section-header">
        <div className="section-title-row">
          <div className="section-dot equity-dot" />
          <h2 className="section-title">Equity</h2>
          <span className="holdings-count">{holdings.length} stocks</span>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard label="Invested" value={totalInvested} />
        <SummaryCard label="Current Value" value={totalCurrent} />
        <SummaryCard
          label="Total P&L"
          value={totalPnL}
          sub={`${totalPnL >= 0 ? '+' : ''}${totalPnLPct.toFixed(2)}%`}
          positive={totalPnL >= 0}
          negative={totalPnL < 0}
        />
        <SummaryCard
          label="Day's Change"
          value={summary.day_change || 0}
          sub={summary.day_change_pct ? `${summary.day_change_pct >= 0 ? '+' : ''}${summary.day_change_pct?.toFixed(2)}%` : ''}
          positive={(summary.day_change || 0) >= 0}
          negative={(summary.day_change || 0) < 0}
        />
      </div>

      {holdings.length > 0 && (
        <div className="chart-row">
          <div className="pie-wrap">
            <p className="chart-label">Allocation</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="table-controls">
        <input
          className="search-input"
          placeholder="Search stocks…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table className="holdings-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">Stock <SortIcon col="name" /></th>
              <th>Qty</th>
              <th>Avg Cost</th>
              <th>LTP</th>
              <th onClick={() => handleSort('value')} className="sortable">Curr Value <SortIcon col="value" /></th>
              <th onClick={() => handleSort('pnl')} className="sortable">P&L <SortIcon col="pnl" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={6} className="empty-row">No holdings found</td></tr>
            ) : (
              sorted.map((h, i) => <HoldingRow key={i} holding={h} type="equity" />)
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EquitySection;