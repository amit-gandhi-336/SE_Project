import React from 'react';

export function GlassCard({
  children,
  variant = 'default', // 'default', 'subtle', 'strong', 'sage', 'mint'
  hover = false,
  padding = '1.75rem',
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'subtle':
        return 'liquid-glass-subtle';
      case 'strong':
        return 'liquid-glass-strong';
      case 'sage':
        return 'liquid-glass-sage';
      case 'mint':
        return 'liquid-glass-mint';
      case 'default':
      default:
        return 'liquid-glass';
    }
  };

  const cardStyle = {
    padding,
    transition: hover ? 'transform var(--transition-normal), box-shadow var(--transition-normal)' : 'none',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return (
    <div
      className={`${getVariantClass()} ${hover ? 'glass-card-hover' : ''} ${className}`}
      style={cardStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
