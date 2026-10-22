import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Sparkles } from 'lucide-react';
import Badge from './Badge';
import GlassCard from './GlassCard';

export function PetCard({ pet, onSponsor }) {
  const [imageError, setImageError] = useState(false);

  // Authentic fallback image based on species
  const fallbackImg = pet.species?.toLowerCase() === 'cat'
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80';

  const photoSrc = (!pet.photoURL || imageError) ? fallbackImg : pet.photoURL;

  return (
    <GlassCard
      hover
      padding="0"
      variant="strong"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        boxShadow: '0 12px 30px -6px rgba(41, 45, 42, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)',
        borderRadius: 'var(--radius-lg)',
        transition: 'transform var(--transition-smooth), box-shadow var(--transition-smooth)'
      }}
    >
      {/* Pet Image Container with Consistent Aspect & Ratio */}
      <div style={{ position: 'relative', height: '235px', overflow: 'hidden', backgroundColor: 'var(--color-cream)' }}>
        <img
          src={photoSrc}
          alt={pet.name}
          loading="lazy"
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* High-Contrast Liquid Glass Status Badge */}
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            zIndex: 3
          }}
        >
          <Badge variant={pet.adoptionStatus || 'Available'}>
            {pet.adoptionStatus || 'Available'}
          </Badge>
        </div>

        {/* Sponsor Count Badge */}
        {pet.sponsorCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '0.85rem',
              right: '0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.90)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--color-terracotta)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.9)',
              border: '1px solid rgba(217, 133, 91, 0.25)',
              zIndex: 3
            }}
          >
            <Sparkles size={13} />
            <span>{pet.sponsorCount} Sponsor{pet.sponsorCount > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Subtle image-to-card transition gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(41, 45, 42, 0.35) 0%, transparent 40%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Card Information Body */}
      <div
        style={{
          padding: '1.25rem 1.35rem 1.35rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
          <h3 style={{ fontSize: '1.28rem', fontWeight: 750, margin: 0, color: 'var(--color-charcoal)' }}>
            {pet.name}
          </h3>
          <span style={{ fontSize: '0.82rem', fontWeight: 650, color: 'var(--color-sage)' }}>
            {pet.species} • {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
          </span>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--color-charcoal-muted)', marginBottom: '0.7rem', fontWeight: 500 }}>
          {pet.breed} • {pet.gender || 'Unknown'}
        </p>

        {pet.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-charcoal-muted)', marginBottom: '1.1rem' }}>
            <MapPin size={14} color="var(--color-sage)" style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pet.location}
            </span>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '0.35rem' }}>
          <Link
            to={`/pets/${pet.petId}`}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.62rem 1rem',
              backgroundColor: 'var(--color-sage)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 650,
              boxShadow: '0 3px 10px rgba(73, 107, 82, 0.25)',
              transition: 'all var(--transition-fast)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-sage-light)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-sage)'}
          >
            Meet {pet.name}
          </Link>

          {onSponsor && (
            <button
              onClick={() => onSponsor(pet)}
              title={`Sponsor ${pet.name}`}
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '1px solid rgba(217, 133, 91, 0.35)',
                backgroundColor: 'rgba(217, 133, 91, 0.1)',
                color: 'var(--color-terracotta)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-terracotta)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(217, 133, 91, 0.1)';
                e.currentTarget.style.color = 'var(--color-terracotta)';
              }}
            >
              <Heart size={18} />
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export default PetCard;
