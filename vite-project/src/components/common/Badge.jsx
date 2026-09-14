import React from 'react';

export function Badge({ children, variant = 'neutral', dot = true, className = '' }) {
  // Normalize variant from string status
  let mappedVariant = variant;
  const lower = String(children || variant).toLowerCase();

  if (['active', 'paid', 'published', 'completed', 'success'].includes(lower)) {
    mappedVariant = 'success';
  } else if (['draft', 'created', 'warning', 'pending'].includes(lower)) {
    mappedVariant = 'warning';
  } else if (['failed', 'cancelled', 'error', 'inactive'].includes(lower)) {
    mappedVariant = 'error';
  } else if (['featured', 'bestseller', 'admin', 'primary'].includes(lower)) {
    mappedVariant = 'primary';
  } else if (['info', 'enrolled'].includes(lower)) {
    mappedVariant = 'info';
  }

  return (
    <span className={`badge badge-${mappedVariant} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
