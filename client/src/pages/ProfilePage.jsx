import React, { useState } from 'react';
import { User, Phone, Mail, Shield, Heart, Building, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Badge from '../components/Badge';
import AlertBanner from '../components/AlertBanner';

export function ProfilePage() {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [adoptionPreferences, setAdoptionPreferences] = useState(user?.adoptionPreferences || '');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        adoptionPreferences: adoptionPreferences.trim()
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '640px' }}>
      <GlassCard padding="2.5rem" style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'var(--color-sage)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(73, 107, 82, 0.3)'
            }}
          >
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{user?.name}</h1>
              <Badge variant={user?.role}>{user?.role}</Badge>
            </div>
            <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
              User Account #{user?.userId}
            </p>
          </div>
        </div>

        {success && <AlertBanner type="success" message={success} onDismiss={() => setSuccess('')} />}
        {error && <AlertBanner type="error" message={error} onDismiss={() => setError('')} />}

        {/* Role Attributes Display */}
        {user?.role === 'ShelterWorker' && (
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(217,133,91,0.08)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-terracotta)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Shelter Staff Credentials
            </div>
            <div style={{ fontSize: '0.92rem' }}>
              Employee ID: <strong>#{user.employeeId}</strong> • Designation: <strong>{user.designation}</strong>
            </div>
          </div>
        )}

        {user?.role === 'Volunteer' && (
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(64,88,120,0.08)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#274567', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Volunteer Squad Assignment
            </div>
            <div style={{ fontSize: '0.92rem' }}>
              Badge: <strong>#{user.volunteerId}</strong> • Area: <strong>{user.serviceArea}</strong> • Availability: <strong>{user.availability}</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(73, 107, 82, 0.3)',
                fontSize: '0.92rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(73, 107, 82, 0.3)',
                fontSize: '0.92rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Contact Phone
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(73, 107, 82, 0.3)',
                fontSize: '0.92rem'
              }}
            />
          </div>

          {user?.role === 'Adopter' && (
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Adoption Preferences
              </label>
              <textarea
                rows={2}
                value={adoptionPreferences}
                onChange={(e) => setAdoptionPreferences(e.target.value)}
                placeholder="e.g. Medium dogs, affectionate cats, vaccinated pets..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          )}

          <Button variant="sage" size="lg" type="submit" loading={loading} style={{ width: '100%' }}>
            Save Profile Updates
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}

export default ProfilePage;
