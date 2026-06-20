import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const HoldingRow = ({ holding, type = 'equity' }) => {
  const pnl = holding.pnl || holding.unrealised_profit || 0;
  const pnlPct = holding.pnl_pct || holding.pnl_percentage || 0;
  const isPositive = pnl >= 0;

  if (type === 'mf') {
    return (
      <tr className="holding-row">
        <td className="holding-name">
          <span className="holding-symbol">{holding.tradingsymbol || holding.fund_name}</span>
          <span className="holding-isin">{holding.folio || holding.isin}</span>
        </td>
        <td className="holding-num">{holding.quantity?.toFixed(3)}</td>
        <td className="holding-num">₹{holding.average_price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
        <td className="holding-num">₹{holding.last_price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
        <td className="holding-num">₹{(holding.quantity * holding.last_price)?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
        <td className={`holding-pnl ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
          ₹{Math.abs(pnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          <span className="pnl-pct">({pnlPct >= 0 ? '+' : ''}{pnlPct?.toFixed(2)}%)</span>
        </td>
      </tr>
    );
  }

  return (
    <tr className="holding-row">
      <td className="holding-name">
        <span className="holding-symbol">{holding.tradingsymbol}</span>
        <span className="holding-isin">{holding.exchange}</span>
      </td>
      <td className="holding-num">{holding.quantity}</td>
      <td className="holding-num">₹{holding.average_price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
      <td className="holding-num">₹{holding.last_price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
      <td className="holding-num">₹{(holding.quantity * holding.last_price)?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
      <td className={`holding-pnl ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
        ₹{Math.abs(pnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        <span className="pnl-pct">({pnlPct >= 0 ? '+' : ''}{pnlPct?.toFixed(2)}%)</span>
      </td>
    </tr>
  );
};

export default HoldingRow;