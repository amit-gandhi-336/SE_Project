import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import AlertBanner from '../components/AlertBanner';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem', maxWidth: '1000px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '0.6rem' }}>
          Get in Touch With Us
        </h1>
        <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Have questions about an adoptable pet, volunteer squad onboarding, or shelter visits? We're here to help.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}
      >
        {/* Contact Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <GlassCard padding="1.75rem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.8rem' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(73, 107, 82, 0.12)',
                  color: 'var(--color-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MapPin size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Main Shelter Facility</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)' }}>Bhavan Rescue Wing</span>
              </div>
            </div>
            <p style={{ color: 'var(--color-charcoal)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Sardar Patel Institute of Technology Campus, Munshi Nagar, Andheri West, Mumbai, Maharashtra 400058
            </p>
          </GlassCard>

          <GlassCard padding="1.75rem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.8rem' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(217, 133, 91, 0.15)',
                  color: 'var(--color-terracotta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Phone size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Emergency Dispatch & Helpline</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)' }}>24/7 Rapid Response</span>
              </div>
            </div>
            <p style={{ color: 'var(--color-charcoal)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Emergency Rescue Hotline: <strong>+91-98765-43210</strong><br />
              Adoption Office: +91-98220-12345
            </p>
          </GlassCard>

          <GlassCard padding="1.75rem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.8rem' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(64, 88, 120, 0.15)',
                  color: '#274567',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Clock size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Shelter Visiting Hours</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)' }}>Adoption Meet & Greets</span>
              </div>
            </div>
            <p style={{ color: 'var(--color-charcoal)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Tuesday – Sunday: 10:00 AM – 6:00 PM<br />
              Mondays: Closed for routine medical checks
            </p>
          </GlassCard>
        </div>

        {/* Message Form */}
        <GlassCard padding="2.25rem" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Send an Inquiry</h2>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            For emergency street rescues, please use our <strong>Rescue Alerts</strong> system instead of this form.
          </p>

          {sent && (
            <AlertBanner
              type="success"
              message="Your inquiry has been received! Our shelter volunteer coordinator will reach out shortly."
              onDismiss={() => setSent(false)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Your Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="priya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Subject
              </label>
              <input
                type="text"
                placeholder="Inquiring about Buddy's adoption status"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Message *
              </label>
              <textarea
                rows={4}
                required
                placeholder="How can our shelter care team assist you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <Button variant="sage" size="lg" type="submit" style={{ width: '100%' }} icon={Send}>
              Send Inquiry
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}

export default ContactPage;
