import React from 'react';

export function LoadingSpinner({ text = 'Loading...', size = 'md' }) {
  const dim = size === 'sm' ? 24 : size === 'lg' ? 48 : 36;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        gap: '1rem',
        color: 'var(--color-charcoal-muted)'
      }}
    >
      <div
        style={{
          width: dim,
          height: dim,
          border: '3px solid rgba(73, 107, 82, 0.2)',
          borderTopColor: 'var(--color-sage)',
          borderRadius: '50%',
          animation: 'spin 0.8s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite'
        }}
      />
      {text && (
        <p style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--color-charcoal-muted)' }}>
          {text}
        </p>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      className="liquid-glass"
      style={{
        overflow: 'hidden',
        height: '380px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          height: '210px',
          backgroundColor: 'rgba(73, 107, 82, 0.08)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      />
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ height: '1.25rem', width: '60%', backgroundColor: 'rgba(73, 107, 82, 0.1)', borderRadius: '4px' }} />
        <div style={{ height: '0.9rem', width: '40%', backgroundColor: 'rgba(73, 107, 82, 0.08)', borderRadius: '4px' }} />
        <div style={{ marginTop: 'auto', height: '2.2rem', width: '100%', backgroundColor: 'rgba(73, 107, 82, 0.08)', borderRadius: '20px' }} />
      </div>
    </div>
  );
}

export default LoadingSpinner;
