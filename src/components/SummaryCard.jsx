import React from 'react';

const SummaryCard = ({ label, value, sub, positive, negative, prefix = '₹' }) => {
  const colorClass = positive ? 'positive' : negative ? 'negative' : '';

  return (
    <div className="summary-card">
      <p className="card-label">{label}</p>
      <p className={`card-value ${colorClass}`}>
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : value}
      </p>
      {sub && <p className={`card-sub ${colorClass}`}>{sub}</p>}
    </div>
  );
};

export default SummaryCard;