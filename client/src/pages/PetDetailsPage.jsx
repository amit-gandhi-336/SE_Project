import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart, ShieldCheck, Sparkles, ArrowLeft, Activity, Info, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import petsApi from '../api/petsApi';
import applicationsApi from '../api/applicationsApi';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';

export function PetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdopter } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Adoption Application Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicantDetails, setApplicantDetails] = useState('');
  const [householdDetails, setHouseholdDetails] = useState('');
  const [previousPetExperience, setPreviousPetExperience] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appError, setAppError] = useState(null);
  const [appSuccess, setAppSuccess] = useState(null);

  // Sponsor State
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [sponsorAmount, setSponsorAmount] = useState('500');
  const [sponsorName, setSponsorName] = useState('');
  const [submittingSponsor, setSubmittingSponsor] = useState(false);

  useEffect(() => {
    async function loadPet() {
      setLoading(true);
      setError(null);
      try {
        const res = await petsApi.getPetById(id);
        if (res?.pet) {
          setPet(res.pet);
        } else {
          setError('Pet details could not be found');
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve pet information');
      } finally {
        setLoading(false);
      }
    }
    loadPet();
  }, [id]);

  // Handle application submission
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!applicantDetails.trim() || !householdDetails.trim()) {
      setAppError('Please provide your applicant profile and household environment details.');
      return;
    }

    setSubmittingApp(true);
    setAppError(null);
    try {
      const res = await applicationsApi.submitApplication({
        petId: Number(pet.petId),
        adopterId: user?.userId,
        applicantDetails: applicantDetails.trim(),
        householdDetails: householdDetails.trim(),
        previousPetExperience: previousPetExperience.trim() || 'First-time pet parent, enthusiastic to learn',
        remarks: remarks.trim() || `Excited to welcome ${pet.name} to our home!`
      });

      if (res?.application) {
        setAppSuccess(res.message || 'Application submitted successfully! Your application is now under review.');
        // Update local pet status to Pending
        setPet(prev => ({ ...prev, adoptionStatus: 'Pending' }));
        setTimeout(() => {
          navigate(`/applications/${res.application.applicationId}`);
        }, 2000);
      }
    } catch (err) {
      setAppError(err.message || 'Failed to submit adoption application');
    } finally {
      setSubmittingApp(false);
    }
  };

  // Handle sponsor submission
  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    setSubmittingSponsor(true);
    try {
      const res = await petsApi.sponsorPet(pet.petId, {
        amount: Number(sponsorAmount),
        sponsorName: sponsorName.trim() || user?.name || 'Kind Supporter'
      });
      setPet(prev => ({ ...prev, sponsorCount: (prev.sponsorCount || 0) + 1 }));
      setSponsorModalOpen(false);
    } catch (err) {
      alert(err.message || 'Sponsorship error');
    } finally {
      setSubmittingSponsor(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <LoadingSpinner text="Retrieving pet file..." size="lg" />
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="container" style={{ paddingTop: '3rem', maxWidth: '600px' }}>
        <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={44} color="#b52828" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Pet Not Found</h2>
          <p style={{ color: 'var(--color-charcoal-muted)', marginBottom: '1.5rem' }}>
            {error || 'The requested pet listing does not exist or may have been removed.'}
          </p>
          <Link to="/pets">
            <Button variant="sage" icon={ArrowLeft}>Back to Available Pets</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const fallbackImg = pet.species?.toLowerCase() === 'cat'
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';

  const photoSrc = (!pet.photoURL || imageError) ? fallbackImg : pet.photoURL;

  return (
    <div className="container" style={{ paddingTop: '1.25rem', paddingBottom: '5rem', maxWidth: '1160px' }}>
      {/* Back button & Breadcrumb */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/pets"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.92rem',
            fontWeight: 600,
            color: 'var(--color-charcoal-muted)',
            transition: 'color 0.15s'
          }}
        >
          <ArrowLeft size={16} /> Back to Browse Pets
        </Link>

        <span style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
          Rescue File ID: <strong>#PET-{pet.petId}</strong>
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Photo & Key Traits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Main Pet Image Card */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 20px 45px -10px rgba(41, 45, 42, 0.12), 0 8px 20px -4px rgba(73, 107, 82, 0.08)',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              height: '440px',
              backgroundColor: 'var(--color-cream)'
            }}
          >
            <img
              src={photoSrc}
              alt={pet.name}
              onError={() => setImageError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Status Badge */}
            <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 2 }}>
              <Badge variant={pet.adoptionStatus} size="md">
                {pet.adoptionStatus}
              </Badge>
            </div>

            {/* Sponsor Badge */}
            {pet.sponsorCount > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  color: 'var(--color-terracotta)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <Sparkles size={15} />
                <span>{pet.sponsorCount} Active Sponsor{pet.sponsorCount > 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Gradient shadow overlay for legibility */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(41, 45, 42, 0.5) 0%, transparent 40%)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.5rem',
                right: '1.5rem',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}
            >
              <div>
                <h2 style={{ color: 'white', fontSize: '1.85rem', margin: 0, fontWeight: 800 }}>
                  {pet.name}
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.92rem', margin: '0.15rem 0 0' }}>
                  {pet.breed}
                </p>
              </div>
              <span style={{ fontSize: '0.9rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                {pet.species}
              </span>
            </div>
          </div>

          {/* Key Attribute Pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.85rem'
            }}
          >
            <GlassCard padding="0.85rem" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>
                Species
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.15rem', color: 'var(--color-charcoal)' }}>
                {pet.species || 'Pet'}
              </div>
            </GlassCard>

            <GlassCard padding="0.85rem" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>
                Age
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.15rem', color: 'var(--color-charcoal)' }}>
                {pet.age} {pet.age === 1 ? 'Yr' : 'Yrs'}
              </div>
            </GlassCard>

            <GlassCard padding="0.85rem" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>
                Gender
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.15rem', color: 'var(--color-charcoal)' }}>
                {pet.gender || 'Unknown'}
              </div>
            </GlassCard>

            <GlassCard padding="0.85rem" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>
                Size
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.15rem', color: 'var(--color-charcoal)' }}>
                {pet.size || 'Medium'}
              </div>
            </GlassCard>
          </div>

          {/* Section 3: Health & Care */}
          <GlassCard variant="mint" padding="1.5rem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(73, 107, 82, 0.18)',
                  color: 'var(--color-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--color-charcoal)' }}>
                  Health & Care Verification
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                  Intake medical examination
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-charcoal)' }}>
              <div>
                <strong>Vaccination Status:</strong>{' '}
                <span style={{ color: 'var(--color-sage)', fontWeight: 600 }}>
                  {pet.vaccinationStatus || 'Up-to-Date / Vaccinated'}
                </span>
              </div>
              <div>
                <strong>Medical Notes:</strong>{' '}
                <span style={{ color: 'var(--color-charcoal-muted)' }}>
                  {pet.medicalNeeds ? pet.medicalNeeds : 'No ongoing medical issues reported during shelter intake.'}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Section 5: Shelter & Location */}
          <GlassCard padding="1.5rem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(217, 133, 91, 0.15)',
                  color: 'var(--color-terracotta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--color-charcoal)' }}>
                  Shelter Location & Custody
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                  Where {pet.name} is currently housed
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div>
                <strong>Location:</strong> {pet.location || 'Bhavan Shelter, Andheri West, Mumbai'}
              </div>
              {pet.addedByName && (
                <div>
                  <strong>Care Coordinator:</strong> {pet.addedByName} (Shelter Worker)
                </div>
              )}
              <p style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)', margin: '0.35rem 0 0' }}>
                Visitations can be coordinated with the shelter team following application approval.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Editorial Overview, Actions & Next Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header Title Block */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-charcoal)' }}>
                {pet.name}
              </h1>
              <span style={{ fontSize: '1.15rem', color: 'var(--color-sage)', fontWeight: 600 }}>
                • {pet.breed}
              </span>
            </div>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6, margin: 0 }}>
              Looking for a loving home with compassionate human companions.
            </p>
          </div>

          {/* Section 1: About This Pet */}
          <GlassCard padding="2rem">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--color-charcoal)' }}>
              About {pet.name}
            </h3>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.75, color: 'var(--color-charcoal-muted)', margin: 0 }}>
              {pet.description || `${pet.name} is a wonderful ${pet.species?.toLowerCase()} looking for a dedicated home. ${pet.gender === 'Female' ? 'She' : 'He'} is calm, responsive to caring handlers, and enjoys affectionate attention.`}
            </p>
          </GlassCard>

          {/* Section 6: Adoption Information & Action */}
          <GlassCard padding="2rem" style={{ border: '1px solid rgba(73, 107, 82, 0.25)', backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--color-charcoal)' }}>
              Adoption Information & Eligibility
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              {pet.adoptionStatus === 'Available'
                ? `Applications for ${pet.name} are currently OPEN. Registered adopters can file an official application below. Our shelter team evaluates living conditions, pet experience, and readiness.`
                : pet.adoptionStatus === 'Pending'
                ? `${pet.name} currently has an adoption application under review by our shelter officer team.`
                : `${pet.name} has found a forever home! Thank you to the compassionate family who welcomed this rescue.`}
            </p>

            {/* Action Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
              {pet.adoptionStatus === 'Available' ? (
                isAuthenticated ? (
                  isAdopter ? (
                    <Button
                      variant="sage"
                      size="lg"
                      icon={Heart}
                      onClick={() => setApplyModalOpen(true)}
                    >
                      Apply to Adopt {pet.name}
                    </Button>
                  ) : (
                    <div style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(73,107,82,0.1)', fontSize: '0.88rem' }}>
                      Logged in as <strong>{user?.role}</strong>. Applications are submitted by Adopter accounts.
                    </div>
                  )
                ) : (
                  <Link to="/login" state={{ from: { pathname: `/pets/${pet.petId}` } }}>
                    <Button variant="sage" size="lg" icon={UserCheck}>
                      Sign In to Apply for Adoption
                    </Button>
                  </Link>
                )
              ) : pet.adoptionStatus === 'Pending' ? (
                <Button variant="glass" size="lg" disabled>
                  Adoption Application Under Review
                </Button>
              ) : (
                <Button variant="glass" size="lg" disabled>
                  Adopted into a Loving Home
                </Button>
              )}

              <Button
                variant="terracotta"
                size="lg"
                icon={Sparkles}
                onClick={() => setSponsorModalOpen(true)}
              >
                Sponsor Care for {pet.name}
              </Button>
            </div>
          </GlassCard>

          {/* Section 7: What Happens Next? */}
          <GlassCard padding="2rem" style={{ backgroundColor: 'rgba(230, 239, 229, 0.4)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-charcoal)' }}>
              What Happens Next? (The Adoption Journey)
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-charcoal-muted)', marginBottom: '1.25rem' }}>
              Our transparent adoption workflow ensures every pet is matched safely and happily.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                {
                  step: '1',
                  title: 'Submit Application',
                  desc: 'Share verified details about your residence, household members, and pet experience.'
                },
                {
                  step: '2',
                  title: 'Shelter Team Evaluation',
                  desc: 'A shelter care officer inspects the application to verify compatibility with the animal.'
                },
                {
                  step: '3',
                  title: 'Decision & Meet-and-Greet',
                  desc: 'Once approved, coordinate a shelter visitation to bond with your future companion.'
                },
                {
                  step: '4',
                  title: 'Homecoming & Support',
                  desc: 'Complete handover documentation and welcome your companion into their forever home.'
                }
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-sage)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: '0.15rem'
                    }}
                  >
                    {step}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-charcoal)' }}>{title}</strong>
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.84rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.5 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Adoption Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Adoption Application for ${pet.name}`}
        maxWidth="620px"
      >
        {appSuccess ? (
          <AlertBanner type="success" message={appSuccess} />
        ) : (
          <form onSubmit={handleApplicationSubmit}>
            {appError && <AlertBanner type="error" message={appError} onDismiss={() => setAppError(null)} />}

            <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Please share verified details about your residence and previous pet care background. Our shelter officers review this information before approving adoptions.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Applicant Profile Details *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Priya Sharma, Senior Software Engineer working remotely with flexible schedule"
                value={applicantDetails}
                onChange={(e) => setApplicantDetails(e.target.value)}
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
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Household & Living Environment *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. 3 BHK apartment with secure balcony, no other pets currently, society park next door"
                value={householdDetails}
                onChange={(e) => setHouseholdDetails(e.target.value)}
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
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Previous Pet Experience
              </label>
              <input
                type="text"
                placeholder="e.g. Cared for a Labrador Retriever for 9 years"
                value={previousPetExperience}
                onChange={(e) => setPreviousPetExperience(e.target.value)}
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
                Remarks or Questions for the Shelter
              </label>
              <input
                type="text"
                placeholder="e.g. Would love to schedule a weekend visit to meet Buddy in person"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="glass" onClick={() => setApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="sage" type="submit" loading={submittingApp} icon={Heart}>
                Submit Official Application
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Sponsor Modal */}
      <Modal
        isOpen={sponsorModalOpen}
        onClose={() => setSponsorModalOpen(false)}
        title={`Sponsor ${pet.name}`}
      >
        <form onSubmit={handleSponsorSubmit}>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
            Directly help fund nutritious food, medical vaccines, and daily care for {pet.name}.
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Sponsor Name (or anonymous)
            </label>
            <input
              type="text"
              placeholder="e.g. Priya"
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
              Contribution (₹)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['250', '500', '1000', '2500'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSponsorAmount(amt)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: sponsorAmount === amt ? '2px solid var(--color-terracotta)' : '1px solid rgba(0,0,0,0.15)',
                    backgroundColor: sponsorAmount === amt ? 'rgba(217, 133, 91, 0.15)' : 'white',
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
            <Button variant="glass" onClick={() => setSponsorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="terracotta" type="submit" loading={submittingSponsor} icon={Sparkles}>
              Sponsor Now
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PetDetailsPage;
