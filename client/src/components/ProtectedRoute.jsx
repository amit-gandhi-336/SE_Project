import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Checking authorization..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div className="liquid-glass" style={{ padding: '2.5rem' }}>
          <h2 style={{ color: 'var(--color-charcoal)', marginBottom: '1rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--color-charcoal-muted)', marginBottom: '1.5rem' }}>
            This page requires the <strong>{allowedRoles.join(' or ')}</strong> role. Your current role is <strong>{user?.role || 'Guest'}</strong>.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.6rem 1.4rem',
              backgroundColor: 'var(--color-sage)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600
            }}
          >
            Return to Safety
          </a>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
