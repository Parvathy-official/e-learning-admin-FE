import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, color = 'var(--primary)', trend }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className="stat-icon" style={{ color, backgroundColor: `${color}18` }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      {trend && (
        <div className={`stat-subtitle ${trend.isPositive ? 'text-success' : 'text-error'}`} style={{ marginTop: '4px' }}>
          <span>{trend.isPositive ? '↑' : '↓'} {trend.text}</span>
        </div>
      )}
    </div>
  );
}
