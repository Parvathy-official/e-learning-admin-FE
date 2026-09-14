import React from 'react';

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <div className="skeleton skeleton-text" style={{ width: '80px', height: '12px' }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}>
                  <div
                    className="skeleton skeleton-text"
                    style={{ width: `${Math.floor(Math.random() * 40) + 50}%` }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatCardSkeleton({ count = 4 }) {
  return (
    <div className="dashboard-stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="stat-card">
          <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: '12px' }} />
          <div className="skeleton skeleton-title" style={{ width: '60%', height: '32px' }} />
          <div className="skeleton skeleton-text" style={{ width: '50%' }} />
        </div>
      ))}
    </div>
  );
}
