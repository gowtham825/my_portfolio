import React from 'react';
import { FiRefreshCw, FiTrendingUp } from 'react-icons/fi';

const Header = ({ onRefresh, lastUpdated, loading }) => {
  return (
    <header className="header">
      <div className="header-left">
        <FiTrendingUp className="header-logo-icon" />
        <div>
          <h1 className="header-title">Portfolio Dashboard</h1>
          <p className="header-subtitle">
            {lastUpdated
              ? `Last updated: ${new Date(lastUpdated).toLocaleTimeString('en-IN')}`
              : 'Live market data'}
          </p>
        </div>
      </div>
      {/* <button
        className={`refresh-btn ${loading ? 'loading' : ''}`}
        onClick={onRefresh}
        disabled={loading}
      >
        <FiRefreshCw className={loading ? 'spin' : ''} />
        {loading ? 'Refreshing...' : 'Refresh'}
      </button> */}
    </header>
  );
};

export default Header;