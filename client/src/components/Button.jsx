import React from 'react';

export function Button({
  children,
  variant = 'sage',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}) {
  const getStyles = () => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: 600,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.65 : 1,
      borderRadius: 'var(--radius-full)',
      transition: 'all var(--transition-fast)',
      border: 'none',
      textDecoration: 'none',
      letterSpacing: '0.01em',
      ...style
    };

    // Sizes
    if (size === 'sm') {
      base.padding = '0.4rem 0.9rem';
      base.fontSize = '0.85rem';
    } else if (size === 'lg') {
      base.padding = '0.85rem 1.8rem';
      base.fontSize = '1.05rem';
    } else {
      base.padding = '0.62rem 1.35rem';
      base.fontSize = '0.94rem';
    }

    // Variants
    switch (variant) {
      case 'sage':
        return {
          ...base,
          backgroundColor: 'var(--color-sage)',
          color: 'var(--color-white)',
          boxShadow: '0 4px 14px rgba(73, 107, 82, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        };
      case 'terracotta':
        return {
          ...base,
          backgroundColor: 'var(--color-terracotta)',
          color: 'var(--color-white)',
          boxShadow: '0 4px 14px rgba(217, 133, 91, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        };
      case 'glass':
        return {
          ...base,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: 'var(--color-charcoal)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 15px rgba(41, 45, 42, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.9)'
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: 'var(--color-sage)',
          border: '1.5px solid var(--color-sage)'
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: 'rgba(209, 67, 67, 0.9)',
          color: 'var(--color-white)',
          boxShadow: '0 4px 14px rgba(209, 67, 67, 0.3)'
        };
      default:
        return base;
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn-interactive ${className}`}
      style={getStyles()}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite'
          }}
        />
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : 18} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : 18} />}
    </button>
  );
}

export default Button;
