import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldAlert, 
  Sparkles, 
  Users, 
  Home, 
  AlertCircle, 
  ClipboardCheck, 
  HeartHandshake, 
  ArrowRight,
  PawPrint
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

export function AboutPage() {
  const steps = [
    {
      num: '01',
      title: 'Report an Animal',
      desc: 'Someone reports an animal in need.',
      icon: AlertCircle,
      accent: 'var(--color-terracotta)',
      bg: 'rgba(217, 133, 91, 0.12)'
    },
    {
      num: '02',
      title: 'Review the Report',
      desc: 'The rescue team assesses the information.',
      icon: ClipboardCheck,
      accent: 'var(--color-sage)',
      bg: 'rgba(73, 107, 82, 0.12)'
    },
    {
      num: '03',
      title: 'Volunteer Assignment',
      desc: 'An available volunteer is assigned where appropriate.',
      icon: Users,
      accent: '#2a5b78',
      bg: 'rgba(42, 91, 120, 0.12)'
    },
    {
      num: '04',
      title: 'Care & Recovery',
      desc: 'The animal receives appropriate assistance.',
      icon: HeartHandshake,
      accent: 'var(--color-sage)',
      bg: 'rgba(73, 107, 82, 0.15)'
    },
    {
      num: '05',
      title: 'A Loving Home',
      desc: 'When suitable, the animal can be considered for adoption.',
      icon: Home,
      accent: 'var(--color-terracotta)',
      bg: 'rgba(217, 133, 91, 0.15)'
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem', maxWidth: '1060px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(73, 107, 82, 0.12)',
            color: 'var(--color-sage)',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}
        >
          <Sparkles size={15} /> Animal Rescue & Adoption Mission
        </div>
        <h1 style={{ fontSize: '3rem', letterSpacing: '-0.025em', marginBottom: '1.25rem', color: 'var(--color-charcoal)' }}>
          About Second Chance
        </h1>
        <p style={{ fontSize: '1.18rem', color: 'var(--color-charcoal-muted)', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
          Every stray, abandoned, or injured pet deserves a safe sanctuary and a devoted family. We connect compassionate adopters, attentive shelter staff, and rapid emergency rescue volunteers into one seamless community.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}
      >
        <GlassCard hover padding="2.25rem">
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              backgroundColor: 'rgba(73, 107, 82, 0.12)',
              color: 'var(--color-sage)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <Heart size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--color-charcoal)' }}>Compassionate Care</h3>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.94rem', lineHeight: 1.65 }}>
            Every rescued animal receives safe housing, nourishing meals, and careful medical observation. We advocate for humane treatment and prioritize getting pets out of shelters and into warm homes.
          </p>
        </GlassCard>

        <GlassCard hover padding="2.25rem">
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              backgroundColor: 'rgba(217, 133, 91, 0.15)',
              color: 'var(--color-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <ShieldAlert size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--color-charcoal)' }}>Rapid Rescue Network</h3>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.94rem', lineHeight: 1.65 }}>
            When an animal is injured or endangered on the street, community members can quickly submit an emergency alert. On-call volunteers are notified to provide timely field assistance.
          </p>
        </GlassCard>

        <GlassCard hover padding="2.25rem">
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              backgroundColor: 'rgba(73, 107, 82, 0.15)',
              color: 'var(--color-sage)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <PawPrint size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem', color: 'var(--color-charcoal)' }}>Thoughtful Adoption</h3>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.94rem', lineHeight: 1.65 }}>
            Our structured adoption application process ensures that every adopter is matched with a pet that suits their household, experience level, and lifestyle for a happy lifetime together.
          </p>
        </GlassCard>
      </div>

      {/* Process Flowchart Section */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.15rem', letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'var(--color-charcoal)' }}>
            How We Give Every Paw a Second Chance
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-charcoal-muted)', maxWidth: '600px', margin: '0 auto' }}>
            From the first report to a safe, loving home, every step matters.
          </p>
        </div>

        {/* Responsive flowchart grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
            gap: '1.25rem',
            position: 'relative'
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <GlassCard
                key={step.num}
                hover
                padding="1.75rem 1.25rem"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  boxShadow: '0 8px 24px rgba(41, 45, 42, 0.05)'
                }}
              >
                {/* Step number badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    color: 'var(--color-charcoal-muted)',
                    opacity: 0.7
                  }}
                >
                  STEP {step.num}
                </span>

                {/* Icon bubble */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    backgroundColor: step.bg,
                    color: step.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '0.75rem',
                    marginBottom: '1.25rem',
                    boxShadow: `0 4px 14px ${step.bg}`
                  }}
                >
                  <Icon size={26} strokeWidth={2.2} />
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-charcoal)' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.55, margin: 0 }}>
                  {step.desc}
                </p>

                {/* Arrow indicator between steps for desktop */}
                {idx < steps.length - 1 && (
                  <div
                    className="flowchart-arrow"
                    style={{
                      display: 'none',
                      position: 'absolute',
                      right: '-14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-cream)',
                      border: '1px solid rgba(73, 107, 82, 0.25)',
                      color: 'var(--color-sage)',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ArrowRight size={14} />
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* How Users Can Help */}
      <GlassCard
        padding="3rem 2.5rem"
        style={{
          backgroundColor: 'rgba(230, 239, 229, 0.45)',
          border: '1px solid rgba(73, 107, 82, 0.25)',
          textAlign: 'center'
        }}
      >
        <h3 style={{ fontSize: '1.8rem', marginBottom: '0.75rem', color: 'var(--color-charcoal)' }}>
          Ready to Make a Difference?
        </h3>
        <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1rem', maxWidth: '620px', margin: '0 auto 2rem', lineHeight: 1.65 }}>
          Whether you have room in your home for a new companion, time to volunteer for animal rescues, or want to report an animal in need, your compassion changes lives.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/pets"
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.98rem' }}
          >
            <PawPrint size={18} /> Meet Adoptable Pets
          </Link>
          <Link
            to="/rescue-alerts"
            className="btn btn-secondary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.98rem' }}
          >
            <ShieldAlert size={18} /> Emergency Rescue Alerts
          </Link>
          <Link
            to="/register?role=Volunteer"
            className="btn btn-ghost"
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.98rem' }}
          >
            <Users size={18} /> Join as a Volunteer
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

export default AboutPage;
