import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ShieldAlert, Heart, ArrowRight, CheckCircle2, Sparkles, Search, Home as HomeIcon } from 'lucide-react';
import petsApi from '../api/petsApi';
import rescueAlertsApi from '../api/rescueAlertsApi';
import GlassCard from '../components/GlassCard';
import PetCard from '../components/PetCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

export function HomePage() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [stats, setStats] = useState({ availableCount: 0, pendingCount: 0, totalAlerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [petsRes, alertsRes] = await Promise.allSettled([
          petsApi.listPets(),
          rescueAlertsApi.listAlerts()
        ]);

        if (petsRes.status === 'fulfilled' && petsRes.value?.pets) {
          const rawPets = petsRes.value.pets;
          // Ensure strictly distinct pet records by unique petId
          const seen = new Set();
          const pets = rawPets.filter(p => {
            if (!p || !p.petId || seen.has(p.petId)) return false;
            seen.add(p.petId);
            return true;
          });
          const available = pets.filter(p => p.adoptionStatus === 'Available');
          const pending = pets.filter(p => p.adoptionStatus === 'Pending');
          setFeaturedPets(available.slice(0, 3));
          setStats(prev => ({
            ...prev,
            availableCount: available.length,
            pendingCount: pending.length
          }));
        }

        if (alertsRes.status === 'fulfilled' && alertsRes.value?.alerts) {
          setStats(prev => ({
            ...prev,
            totalAlerts: alertsRes.value.alerts.length
          }));
        }
      } catch (err) {
        console.error('Error fetching home statistics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '1rem' }}>
      {/* Hero Section */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '5.5rem',
          paddingTop: '1.5rem'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(73, 107, 82, 0.12)',
              color: 'var(--color-sage)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              border: '1px solid rgba(73, 107, 82, 0.2)'
            }}
          >
            <Sparkles size={15} />
            Compassionate Rescue & Adoption
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              marginBottom: '1.25rem'
            }}
          >
            Every Paw Deserves a <span style={{ color: 'var(--color-sage)' }}>Second Chance.</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--color-charcoal-muted)',
              lineHeight: 1.65,
              marginBottom: '2rem',
              maxWidth: '540px'
            }}
          >
            Meet your new best friend, help an animal in need, and be part of a community that gives every pet a chance at a loving home.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/pets">
              <Button variant="sage" size="lg" icon={Search}>
                Find Your Companion
              </Button>
            </Link>
            <Link to="/rescue-alerts">
              <Button variant="terracotta" size="lg" icon={ShieldAlert}>
                Report an Animal in Need
              </Button>
            </Link>
          </div>

          {/* Quick Metrics from Real Backend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(73, 107, 82, 0.12)'
            }}
          >
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-sage)', fontFamily: 'var(--font-heading)' }}>
                {stats.availableCount}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>
                Pets Awaiting Homes
              </div>
            </div>

            <div style={{ width: 1, height: 35, backgroundColor: 'rgba(73, 107, 82, 0.15)' }} />

            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-terracotta)', fontFamily: 'var(--font-heading)' }}>
                {stats.totalAlerts}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>
                Rescue Missions Logged
              </div>
            </div>

            <div style={{ width: 1, height: 35, backgroundColor: 'rgba(73, 107, 82, 0.15)' }} />

            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#274567', fontFamily: 'var(--font-heading)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>
                Health Verified
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image with Floating Glass Badges */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(41, 45, 42, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              height: '460px'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"
              alt="Happy adopted dogs playing"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Floating Glass Highlight Card 1 */}
          <div
            className="liquid-glass-strong"
            style={{
              position: 'absolute',
              bottom: '-1.5rem',
              left: '-1rem',
              padding: '1rem 1.25rem',
              maxWidth: '260px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem'
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                backgroundColor: 'rgba(73, 107, 82, 0.15)',
                color: 'var(--color-sage)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Heart size={22} fill="var(--color-sage)" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                Direct Adoption
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-charcoal-muted)' }}>
                Full medical checks & shelter care
              </div>
            </div>
          </div>

          {/* Floating Glass Highlight Card 2 */}
          <div
            className="liquid-glass-strong"
            style={{
              position: 'absolute',
              top: '2rem',
              right: '-1.25rem',
              padding: '0.85rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <ShieldAlert size={20} color="var(--color-terracotta)" />
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              Rapid Rescue Response
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section style={{ marginBottom: '6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ color: 'var(--color-sage)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Meet Our Friends
            </div>
            <h2 style={{ fontSize: '2.2rem' }}>
              Ready for Their Forever Homes
            </h2>
          </div>
          <Link to="/pets">
            <Button variant="glass" icon={ArrowRight} iconPosition="right">
              View All Pets
            </Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading available companions..." />
        ) : featuredPets.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {featuredPets.map(pet => (
              <PetCard key={pet.petId} pet={pet} />
            ))}
          </div>
        ) : (
          <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-charcoal-muted)' }}>
              No pets currently listed as available. Check back soon!
            </p>
          </GlassCard>
        )}
      </section>

      {/* How Adoption Works */}
      <section style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
          <div style={{ color: 'var(--color-sage)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Simple, Transparent Steps
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            How Adoption Works
          </h2>
          <p style={{ color: 'var(--color-charcoal-muted)' }}>
            Our shelter team ensures every pet is matched with a welcoming environment through a transparent, verified workflow.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}
        >
          <GlassCard hover>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                backgroundColor: 'rgba(73, 107, 82, 0.12)',
                color: 'var(--color-sage)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
                marginBottom: '1.25rem'
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Explore & Connect</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6 }}>
              Browse our verified shelter pets, review medical records, temperaments, and find the companion that fits your lifestyle.
            </p>
          </GlassCard>

          <GlassCard hover>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                backgroundColor: 'rgba(217, 133, 91, 0.15)',
                color: 'var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
                marginBottom: '1.25rem'
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Submit Application</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6 }}>
              Complete the digital adoption application with your household setup and pet background. Shelter officers review each request.
            </p>
          </GlassCard>

          <GlassCard hover>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                backgroundColor: 'rgba(64, 88, 120, 0.15)',
                color: '#274567',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
                marginBottom: '1.25rem'
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Welcome Them Home</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6 }}>
              Upon approval, finalize your adoption agreement, pick up your new family member, and begin your lifelong journey together.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Rescue Alert Emergency Banner */}
      <section
        className="liquid-glass-strong"
        style={{
          padding: '3rem 2.5rem',
          backgroundColor: 'rgba(248, 244, 234, 0.85)',
          border: '1px solid rgba(217, 133, 91, 0.3)',
          marginBottom: '5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-terracotta)',
              fontWeight: 700,
              fontSize: '0.85rem',
              marginBottom: '0.75rem'
            }}
          >
            <ShieldAlert size={16} />
            EMERGENCY ANIMAL RESCUE NETWORK
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
            Spotted an Injured or Stranded Animal?
          </h2>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Report real-time GPS coordinates, description, and severity. Our registered volunteer rescue squad responds immediately to triage and provide medical assistance.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/rescue-alerts">
            <Button variant="terracotta" size="lg" icon={ShieldAlert}>
              File a Rescue Alert
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="glass" size="lg">
              Learn About Our Rescue Squad
            </Button>
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: '5rem'
        }}
      >
        <div
          style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            height: '380px',
            boxShadow: 'var(--glass-shadow-lg)'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80"
            alt="Rescue dog resting peacefully"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div>
          <div style={{ color: 'var(--color-sage)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Our Mission & Philosophy
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
            Empowering Shelter Workers, Adopters & Volunteers
          </h2>
          <p style={{ color: 'var(--color-charcoal-muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            Second Chance bridges the operational gap between crowded animal shelters, willing adoptive families, and street rescue volunteers. Built directly around verified software engineering principles, our platform enforces end-to-end data integrity for pet care and rescue operations.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>
              <CheckCircle2 size={18} color="var(--color-sage)" />
              Automated pet status synchronization upon application review
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>
              <CheckCircle2 size={18} color="var(--color-sage)" />
              Real-time volunteer rescue assignment and closure tracking
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>
              <CheckCircle2 size={18} color="var(--color-sage)" />
              Secure, authenticated role-based governance for shelter safety
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
