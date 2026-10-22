import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Option A — Animated Ambient Radial Gradients (Global Layer)
 * 
 * Palette:
 * - Warm Cream #F8F4EA (Foundation base)
 * - Sage Forest #496B52 (Corner & Edge glows)
 * - Soft Mint #E6EFE5 (Edge & Ambient glows)
 * - Warm White #FFFFFF (Soft highlight stops)
 * 
 * Variants:
 * 1. Website Mode (All non-auth routes):
 *    - Gentle, elegant radial gradient motion (6–8s per cycle).
 * 2. Auth Mode (Login & Sign Up):
 *    - Slightly faster, noticeably moving ambient radial gradient motion (4–5s per cycle).
 *    - Flowing center and corner gradients visible behind the translucent form cards.
 * 
 * Rules:
 * - Pure abstract radial gradients: no leaves, particles, floating objects, or light beams.
 * - Stacking: fixed behind all content (z-index: 0, pointer-events: none).
 * - Avoids heavy blur filters (blur: 28px) for maximum smoothness and GPU efficiency.
 * - Respects prefers-reduced-motion.
 */
export function SunlightLeavesBackground() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div
      className={`option-a-fixed-canvas ${isAuthRoute ? 'auth-mode' : 'website-mode'}`}
      aria-hidden="true"
    >
      {/* 1. Base Warm Cream Foundation */}
      <div className="option-a-base-cream" />

      {/* 2. Soft Sage & Mint Corner Radial Gradients */}
      <div className="ambient-radial-node node-top-left" />
      <div className="ambient-radial-node node-top-right" />
      <div className="ambient-radial-node node-bottom-left" />
      <div className="ambient-radial-node node-bottom-right" />

      {/* 3. Subtle Edge Balance Radial Gradients */}
      <div className="ambient-radial-node node-mid-left" />
      <div className="ambient-radial-node node-mid-right" />

      {/* 4. Center Ambient Flow Radial Gradient (visible behind form cards & content) */}
      <div className="ambient-radial-node node-center-flow" />
    </div>
  );
}

export default SunlightLeavesBackground;

