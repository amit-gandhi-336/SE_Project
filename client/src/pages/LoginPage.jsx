import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Key, Mail, PawPrint, Sparkles, UserCheck, Shield, Building, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import AlertBanner from '../components/AlertBanner';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await login(email, password);
      // Redirect according to role or previous page
      if (location.state?.from) {
        navigate(from, { replace: true });
      } else if (loggedInUser.role === 'ShelterWorker') {
        navigate('/shelter/dashboard');
      } else if (loggedInUser.role === 'Volunteer') {
        navigate('/volunteer/dashboard');
      } else {
        navigate('/pets');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for development & grading demo
  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    setError(null);
  };

  return (
    <div
      className="container"
      style={{
        paddingTop: '2.5rem',
        paddingBottom: '4rem',
        maxWidth: '520px',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
        <GlassCard
          padding="2.75rem 2.25rem"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 24px 50px -12px rgba(41, 45, 42, 0.14), 0 8px 24px -4px rgba(73, 107, 82, 0.08)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '16px',
                backgroundColor: 'var(--color-sage)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.15rem',
                boxShadow: '0 6px 18px rgba(73, 107, 82, 0.35)'
              }}
            >
              <PawPrint size={26} />
            </div>
            <h1 style={{ fontSize: '2.1rem', letterSpacing: '-0.02em', marginBottom: '0.45rem', color: 'var(--color-charcoal)' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.94rem', lineHeight: 1.5 }}>
              Sign in to manage adoptions, review applications, and volunteer.
            </p>
          </div>

          {error && <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--color-charcoal)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--color-charcoal-muted)" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.72rem 1rem 0.72rem 2.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(73, 107, 82, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.94rem',
                    color: 'var(--color-charcoal)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-sage)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(73, 107, 82, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(73, 107, 82, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <Key size={18} color="var(--color-charcoal-muted)" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.72rem 1rem 0.72rem 2.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(73, 107, 82, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.94rem',
                    color: 'var(--color-charcoal)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-sage)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(73, 107, 82, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(73, 107, 82, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <Button
              variant="sage"
              size="lg"
              type="submit"
              loading={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 6px 20px rgba(73, 107, 82, 0.25)'
              }}
              icon={LogIn}
            >
              Sign In to Account
            </Button>
          </form>

          {/* Quick Demo Accounts */}
          <div
            style={{
              marginTop: '2.25rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(73, 107, 82, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
              <Sparkles size={14} /> Quick Demo Logins (Development Accounts)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {/* Aryan Gosavi - Shelter Worker */}
              <button
                type="button"
                onClick={() => fillDemoAccount('aryan@spit.ac.in')}
                className="btn-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(73, 107, 82, 0.25)',
                  backgroundColor: 'rgba(73, 107, 82, 0.08)',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={14} color="var(--color-sage)" />
                  <span><strong>Shelter Worker:</strong> Aryan Gosavi</span>
                </div>
                <span style={{ color: 'var(--color-sage)', fontWeight: 600 }}>aryan@spit.ac.in</span>
              </button>

              {/* Amit Gandhi - Shelter Worker */}
              <button
                type="button"
                onClick={() => fillDemoAccount('amit@spit.ac.in')}
                className="btn-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(73, 107, 82, 0.2)',
                  backgroundColor: 'rgba(73, 107, 82, 0.05)',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={14} color="var(--color-sage)" />
                  <span><strong>Shelter Worker:</strong> Amit Gandhi</span>
                </div>
                <span style={{ color: 'var(--color-sage)', fontWeight: 600 }}>amit@spit.ac.in</span>
              </button>

              {/* Priya Sharma - Adopter */}
              <button
                type="button"
                onClick={() => fillDemoAccount('priya@gmail.com')}
                className="btn-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(217, 133, 91, 0.25)',
                  backgroundColor: 'rgba(217, 133, 91, 0.08)',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={14} color="var(--color-terracotta)" />
                  <span><strong>Adopter:</strong> Priya Sharma</span>
                </div>
                <span style={{ color: 'var(--color-terracotta)', fontWeight: 600 }}>priya@gmail.com</span>
              </button>

              {/* Vikram Singh - Volunteer */}
              <button
                type="button"
                onClick={() => fillDemoAccount('vikram@rescue.org')}
                className="btn-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(64, 88, 120, 0.25)',
                  backgroundColor: 'rgba(64, 88, 120, 0.08)',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={14} color="#274567" />
                  <span><strong>Volunteer:</strong> Vikram Singh</span>
                </div>
                <span style={{ color: '#274567', fontWeight: 600 }}>vikram@rescue.org</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.85rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-charcoal-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--color-sage)', fontWeight: 700 }}>
              Create one here
            </Link>
          </div>
        </GlassCard>
    </div>
  );
}

export default LoginPage;
