import React from 'react';

/**
 * Premium Liquid Glass Status Badge
 * - Translucent high-opacity surface (88%–92%) for crystal-clear readability over photos
 * - Subtle glass blur effect (8px)
 * - Fine contrasting border
 * - Clear status dot indicator
 * - Restrained inset highlight & soft shadow
 * - Distinct colors for Available (sage/mint), Pending (warm amber/terracotta),
 *   Adopted (restrained sage-slate), and Rejected/Closed (muted neutral).
 */
export function Badge({ children, variant = 'neutral', size = 'md', className = '', style = {} }) {
  const getVariantStyles = () => {
    const v = String(variant).toLowerCase();

    // 1. Available / Active / Open (Pale Sage & Mint)
    if (v === 'available' || v === 'active' || v === 'open' || v === 'success' || v === 'shelterworker') {
      return {
        bg: 'rgba(238, 246, 238, 0.90)',
        text: '#1e3b26',
        dot: '#2e633d',
        border: 'rgba(73, 107, 82, 0.32)'
      };
    }

    // 2. Pending / Under Review / Warning / Assigned / In Progress (Warm Amber & Terracotta)
    if (
      v === 'pending' ||
      v === 'under review' ||
      v === 'warning' ||
      v === 'medium' ||
      v === 'assigned' ||
      v === 'in progress' ||
      v === 'submitted' ||
      v === 'volunteer'
    ) {
      return {
        bg: 'rgba(254, 246, 240, 0.92)',
        text: '#8c3e16',
        dot: '#d9855b',
        border: 'rgba(217, 133, 91, 0.36)'
      };
    }

    // 3. Adopted / Approved / Completed (Restrained Sage & Slate)
    if (v === 'adopted' || v === 'approved' || v === 'completed' || v === 'adopter') {
      return {
        bg: 'rgba(238, 244, 247, 0.92)',
        text: '#1f4254',
        dot: '#3d6c85',
        border: 'rgba(61, 108, 133, 0.32)'
      };
    }

    // 4. Critical / High / Danger (Rescue alerts)
    if (v === 'critical' || v === 'high' || v === 'danger') {
      return {
        bg: 'rgba(254, 242, 242, 0.92)',
        text: '#9c1c1c',
        dot: '#d14343',
        border: 'rgba(209, 67, 67, 0.35)'
      };
    }

    // 5. Rejected / Closed / Low / Neutral (Muted Neutral)
    return {
      bg: 'rgba(244, 245, 244, 0.92)',
      text: '#3f4541',
      dot: '#6e7570',
      border: 'rgba(90, 100, 93, 0.30)'
    };
  };

  const v = getVariantStyles();
  const isSm = size === 'sm';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? '0.35rem' : '0.45rem',
        padding: isSm ? '0.2rem 0.6rem' : '0.32rem 0.85rem',
        fontSize: isSm ? '0.72rem' : '0.82rem',
        fontWeight: 650,
        borderRadius: 'var(--radius-full)',
        backgroundColor: v.bg,
        color: v.text,
        border: `1px solid ${v.border}`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
        ...style
      }}
    >
      <span
        style={{
          width: isSm ? 6 : 7,
          height: isSm ? 6 : 7,
          borderRadius: '50%',
          backgroundColor: v.dot,
          flexShrink: 0,
          boxShadow: `0 0 4px ${v.dot}44`
        }}
      />
      {children}
    </span>
  );
}

export default Badge;
