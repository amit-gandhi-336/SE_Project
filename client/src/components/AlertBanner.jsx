import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export function AlertBanner({ type = 'info', message, onDismiss, className = '' }) {
  if (!message) return null;

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(73, 107, 82, 0.1)',
          border: 'rgba(73, 107, 82, 0.3)',
          color: '#284d33',
          icon: CheckCircle2
        };
      case 'error':
        return {
          bg: 'rgba(209, 67, 67, 0.1)',
          border: 'rgba(209, 67, 67, 0.3)',
          color: '#a82323',
          icon: AlertCircle
        };
      case 'warning':
        return {
          bg: 'rgba(217, 133, 91, 0.15)',
          border: 'rgba(217, 133, 91, 0.35)',
          color: '#9e461a',
          icon: AlertTriangle
        };
      case 'info':
      default:
        return {
          bg: 'rgba(64, 88, 120, 0.1)',
          border: 'rgba(64, 88, 120, 0.3)',
          color: '#203957',
          icon: Info
        };
    }
  };

  const { bg, border, color, icon: Icon } = getConfig();

  return (
    <div
      role="alert"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        fontSize: '0.92rem',
        fontWeight: 500,
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '0.2rem',
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default AlertBanner;
