import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RotateCcw, Sparkles } from 'lucide-react';
import petsApi from '../api/petsApi';
import PetCard from '../components/PetCard';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import AlertBanner from '../components/AlertBanner';
import { SkeletonCard } from '../components/LoadingSpinner';

export function BrowsePetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('All');
  const [adoptionStatus, setAdoptionStatus] = useState('All');

  // Sponsor Modal State
  const [sponsorPet, setSponsorPet] = useState(null);
  const [sponsorAmount, setSponsorAmount] = useState('500');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorSubmitting, setSponsorSubmitting] = useState(false);
  const [sponsorSuccess, setSponsorSuccess] = useState('');

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await petsApi.listPets({
        search: search.trim() || undefined,
        species: species !== 'All' ? species : undefined,
        adoptionStatus: adoptionStatus !== 'All' ? adoptionStatus : undefined
      });
      const rawPets = res.pets || [];
      // Guarantee unique pet identities
      const seen = new Set();
      const distinctPets = rawPets.filter(p => {
        if (!p || !p.petId || seen.has(p.petId)) return false;
        seen.add(p.petId);
        return true;
      });
      setPets(distinctPets);
    } catch (err) {
      setError(err.message || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  }, [search, species, adoptionStatus]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleResetFilters = () => {
    setSearch('');
    setSpecies('All');
    setAdoptionStatus('All');
  };

  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    if (!sponsorPet) return;
    setSponsorSubmitting(true);
    try {
      const res = await petsApi.sponsorPet(sponsorPet.petId, {
        amount: Number(sponsorAmount),
        sponsorName: sponsorName.trim() || 'Anonymous Supporter'
      });
      setSponsorSuccess(res.message || 'Thank you for your generous sponsorship!');
      // Update local pet sponsor count
      setPets(prev => prev.map(p => p.petId === sponsorPet.petId ? { ...p, sponsorCount: (p.sponsorCount || 0) + 1 } : p));
      setTimeout(() => {
        setSponsorPet(null);
        setSponsorSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Sponsorship submission failed');
    } finally {
      setSponsorSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1rem', minHeight: '80vh' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>
          Find Your Forever Companion
        </h1>
        <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1.05rem' }}>
          Browse all rescue animals currently sheltered and cared for by our dedicated community.
        </p>
      </div>

      {/* Floating Filter Panel */}
      <GlassCard
        style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '2.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.85)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1.25rem',
            justifyContent: 'space-between'
          }}
        >
          {/* Search bar */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 260px',
              maxWidth: '400px'
            }}
          >
            <Search
              size={18}
              color="var(--color-charcoal-muted)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by name, breed, or shelter location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.6rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(73, 107, 82, 0.25)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.92rem',
                color: 'var(--color-charcoal)',
                outline: 'none'
              }}
            />
          </div>

          {/* Species Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal-muted)', marginRight: '0.2rem' }}>
              Species:
            </span>
            {['All', 'Dog', 'Cat'].map((s) => (
              <button
                key={s}
                onClick={() => setSpecies(s)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: species === s ? '1px solid var(--color-sage)' : '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: species === s ? 'var(--color-sage)' : 'rgba(255, 255, 255, 0.7)',
                  color: species === s ? 'white' : 'var(--color-charcoal)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal-muted)', marginRight: '0.2rem' }}>
              Status:
            </span>
            {['All', 'Available', 'Pending', 'Adopted'].map((status) => (
              <button
                key={status}
                onClick={() => setAdoptionStatus(status)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: adoptionStatus === status ? '1px solid var(--color-terracotta)' : '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: adoptionStatus === status ? 'var(--color-terracotta)' : 'rgba(255, 255, 255, 0.7)',
                  color: adoptionStatus === status ? 'white' : 'var(--color-charcoal)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {(search || species !== 'All' || adoptionStatus !== 'All') && (
            <button
              onClick={handleResetFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'none',
                border: 'none',
                color: 'var(--color-charcoal-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.35rem 0.6rem'
              }}
            >
              <RotateCcw size={14} /> Reset Filters
            </button>
          )}
        </div>
      </GlassCard>

      {error && <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />}

      {/* Pet Card Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <SkeletonCard key={k} />
          ))}
        </div>
      ) : pets.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}
        >
          {pets.map((pet) => (
            <PetCard
              key={pet.petId}
              pet={pet}
              onSponsor={(p) => setSponsorPet(p)}
            />
          ))}
        </div>
      ) : (
        <GlassCard style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
            No pets found matching your criteria
          </h3>
          <p style={{ color: 'var(--color-charcoal-muted)', marginBottom: '1.5rem' }}>
            Try broadening your search term or clearing filters to see more animals.
          </p>
          <Button variant="outline" onClick={handleResetFilters} icon={RotateCcw}>
            Clear All Filters
          </Button>
        </GlassCard>
      )}

      {/* Sponsor Modal */}
      <Modal
        isOpen={!!sponsorPet}
        onClose={() => setSponsorPet(null)}
        title={sponsorPet ? `Sponsor ${sponsorPet.name}` : 'Sponsor a Pet'}
      >
        {sponsorSuccess ? (
          <AlertBanner type="success" message={sponsorSuccess} />
        ) : (
          <form onSubmit={handleSponsorSubmit}>
            <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
              Your sponsorship helps fund medical care, nutritious meals, vaccinations, and shelter comforts for <strong>{sponsorPet?.name}</strong>.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Your Name (or leave anonymous)
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Contribution Amount (₹)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {['250', '500', '1000', '2500'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSponsorAmount(amt)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: sponsorAmount === amt ? '2px solid var(--color-sage)' : '1px solid rgba(0,0,0,0.15)',
                      backgroundColor: sponsorAmount === amt ? 'rgba(73, 107, 82, 0.1)' : 'white',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="glass" onClick={() => setSponsorPet(null)}>
                Cancel
              </Button>
              <Button variant="terracotta" type="submit" loading={sponsorSubmitting} icon={Sparkles}>
                Confirm Sponsorship
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default BrowsePetsPage;
