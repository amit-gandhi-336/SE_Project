import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Key, Phone, Sparkles, Building, Heart, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import AlertBanner from '../components/AlertBanner';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('Adopter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91-');

  // Adopter specific
  const [adoptionPreferences, setAdoptionPreferences] = useState('');

  // ShelterWorker specific
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('Animal Care Specialist');

  // Volunteer specific
  const [volunteerId, setVolunteerId] = useState('');
  const [availability, setAvailability] = useState('Weekends & On-Call');
  const [serviceArea, setServiceArea] = useState('Andheri & Juhu, Mumbai');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim(),
        role
      };

      if (role === 'Adopter') {
        payload.adoptionPreferences = adoptionPreferences.trim() || 'Friendly apartment pets';
      } else if (role === 'ShelterWorker') {
        payload.employeeId = employeeId ? Number(employeeId) : Math.floor(100 + Math.random() * 900);
        payload.designation = designation.trim() || 'Animal Care Specialist';
      } else if (role === 'Volunteer') {
        payload.volunteerId = volunteerId ? Number(volunteerId) : Math.floor(500 + Math.random() * 500);
        payload.availability = availability.trim() || 'Weekends & On-Call';
        payload.serviceArea = serviceArea.trim() || 'Mumbai Metro Region';
      }

      const createdUser = await register(payload);
      if (createdUser.role === 'ShelterWorker') {
        navigate('/shelter/dashboard');
      } else if (createdUser.role === 'Volunteer') {
        navigate('/volunteer/dashboard');
      } else {
        navigate('/pets');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        paddingTop: '2rem',
        paddingBottom: '4rem',
        maxWidth: '560px',
        minHeight: '80vh'
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
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '2.1rem', letterSpacing: '-0.02em', marginBottom: '0.4rem', color: 'var(--color-charcoal)' }}>
              Create Your Account
            </h1>
            <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.94rem' }}>
              Choose your community role and join Second Chance.
            </p>

          {/* Role selector tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginTop: '1.5rem',
              backgroundColor: 'rgba(73, 107, 82, 0.08)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            {[
              { id: 'Adopter', label: 'Adopter', icon: Heart },
              { id: 'ShelterWorker', label: 'Shelter Staff', icon: Building },
              { id: 'Volunteer', label: 'Volunteer', icon: Shield }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: role === id ? 'var(--color-sage)' : 'transparent',
                  color: role === id ? 'white' : 'var(--color-charcoal)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit}>
          {/* Base User Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Mehta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="+91-9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(73, 107, 82, 0.3)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Create Password *
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(73, 107, 82, 0.3)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Role-Specific Subclass Fields */}
          {role === 'Adopter' && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(230,239,229,0.5)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-sage)' }}>
                Adoption Preferences (e.g. breed, size, temperament)
              </label>
              <input
                type="text"
                placeholder="e.g. Calm affectionate indoor cats, or friendly medium dogs"
                value={adoptionPreferences}
                onChange={(e) => setAdoptionPreferences(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.25)',
                  fontSize: '0.9rem',
                  backgroundColor: 'white'
                }}
              />
            </div>
          )}

          {role === 'ShelterWorker' && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(217,133,91,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Employee ID
                  </label>
                  <input
                    type="number"
                    placeholder="108"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(217, 133, 91, 0.3)',
                      fontSize: '0.88rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="Animal Care Officer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(217, 133, 91, 0.3)',
                      fontSize: '0.88rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'Volunteer' && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(64,88,120,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Availability
                  </label>
                  <input
                    type="text"
                    placeholder="Weekends & On-Call"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(64, 88, 120, 0.3)',
                      fontSize: '0.88rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Service Area
                  </label>
                  <input
                    type="text"
                    placeholder="Andheri & Juhu, Mumbai"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(64, 88, 120, 0.3)',
                      fontSize: '0.88rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <Button variant="sage" size="lg" type="submit" loading={loading} style={{ width: '100%' }} icon={UserPlus}>
            Complete Registration ({role})
          </Button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-charcoal-muted)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--color-sage)', fontWeight: 700 }}>
            Sign in here
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

export default RegisterPage;
