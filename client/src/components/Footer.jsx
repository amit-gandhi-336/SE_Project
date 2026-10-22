import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart, ShieldAlert, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: '6rem',
        borderTop: '1px solid rgba(73, 107, 82, 0.15)',
        backgroundColor: 'rgba(230, 239, 229, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '4rem 1.5rem 2.5rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Column 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-sage)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PawPrint size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                Second <span style={{ color: 'var(--color-sage)' }}>Chance</span>
              </span>
            </div>
            <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Every paw deserves a loving home. Connecting compassionate adopters, dedicated shelter teams, and rapid-response rescue volunteers.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(217, 133, 91, 0.12)',
                color: 'var(--color-terracotta)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <ShieldAlert size={14} />
              24/7 Animal Emergency Reporting
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--color-charcoal)' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/pets" style={{ color: 'var(--color-charcoal-muted)', transition: 'color 0.15s' }}>
                  Available Pets
                </Link>
              </li>
              <li>
                <Link to="/rescue-alerts" style={{ color: 'var(--color-charcoal-muted)' }}>
                  Active Rescue Alerts
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--color-charcoal-muted)' }}>
                  How Adoption Works
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--color-charcoal-muted)' }}>
                  Shelter Directory & Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Roles */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--color-charcoal)' }}>
              Platform Roles
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--color-charcoal-muted)' }}>
              <li><strong>Adopters:</strong> View profiles, submit & track adoption applications.</li>
              <li><strong>Shelter Workers:</strong> Manage inventory, review & approve adoptions.</li>
              <li><strong>Volunteers:</strong> Rapid emergency response & rescue missions.</li>
            </ul>
          </div>

          {/* Column 4: Contact & Emergency */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--color-charcoal)' }}>
              Rescue & Shelter Hub
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--color-charcoal-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} color="var(--color-sage)" />
                Bhavan Shelter, Andheri West, Mumbai
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="var(--color-sage)" />
                Rescue Hotline: +91-98765-43210
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="var(--color-sage)" />
                support@secondchance.org
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(73, 107, 82, 0.12)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.88rem',
            color: 'var(--color-charcoal-muted)'
          }}
        >
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} Second Chance. Give Them a Home. Find Your Best Friend.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-charcoal)', fontWeight: 500 }}>
            <span>Made with care for animals in need.</span>
            <Heart size={14} color="var(--color-terracotta)" fill="var(--color-terracotta)" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
