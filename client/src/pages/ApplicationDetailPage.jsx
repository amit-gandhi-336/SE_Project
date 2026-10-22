import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Home, Award, CheckCircle2, XCircle, Clock, ShieldCheck, Heart } from 'lucide-react';
import applicationsApi from '../api/applicationsApi';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';

export function ApplicationDetailPage() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadApp() {
      setLoading(true);
      try {
        const res = await applicationsApi.trackApplication(id);
        if (res?.application) {
          setApp(res.application);
        } else {
          setError('Application record could not be found');
        }
      } catch (err) {
        setError(err.message || 'Failed to track application');
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <LoadingSpinner text="Retrieving live application tracking..." size="lg" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="container" style={{ paddingTop: '3rem', maxWidth: '600px' }}>
        <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Application Not Found</h2>
          <p style={{ color: 'var(--color-charcoal-muted)', marginBottom: '1.5rem' }}>
            {error || 'The application file could not be retrieved.'}
          </p>
          <Link to="/applications">
            <Button variant="sage" icon={ArrowLeft}>Back to My Applications</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/applications"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--color-charcoal-muted)'
          }}
        >
          <ArrowLeft size={16} /> Back to All Applications
        </Link>
      </div>

      <GlassCard padding="2.5rem" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(73, 107, 82, 0.15)',
            marginBottom: '2rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Official Adoption Record
            </span>
            <h1 style={{ fontSize: '2.2rem', margin: '0.2rem 0' }}>
              Application #{app.applicationId}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-charcoal-muted)' }}>
              <Calendar size={15} /> Filed on {app.applicationDate}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', marginBottom: '0.3rem' }}>
              Application Status
            </div>
            <Badge variant={app.status} size="lg">
              {app.status}
            </Badge>
          </div>
        </div>

        {/* Associated Pet Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(230, 239, 229, 0.5)',
            border: '1px solid rgba(73, 107, 82, 0.2)',
            marginBottom: '2rem'
          }}
        >
          {app.petPhoto && (
            <img
              src={app.petPhoto}
              alt={app.petName}
              style={{ width: 70, height: 70, borderRadius: '12px', objectFit: 'cover' }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-sage)', textTransform: 'uppercase' }}>
              Selected Pet Profile
            </div>
            <h3 style={{ fontSize: '1.3rem', margin: '0.1rem 0' }}>{app.petName}</h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-charcoal-muted)' }}>
              {app.petSpecies} • {app.petBreed} • Current status: <strong>{app.petStatus}</strong>
            </div>
          </div>
          <Link to={`/pets/${app.petId}`}>
            <Button variant="glass" size="sm">
              View Pet Listing
            </Button>
          </Link>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
              <User size={16} color="var(--color-sage)" />
              Applicant Profile Details
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6, backgroundColor: 'rgba(255,255,255,0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              {app.applicantDetails}
            </p>
          </div>

          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
              <Home size={16} color="var(--color-sage)" />
              Household & Living Setup
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6, backgroundColor: 'rgba(255,255,255,0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              {app.householdDetails}
            </p>
          </div>
        </div>

        {/* Previous Experience */}
        {app.previousPetExperience && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
              <Award size={16} color="var(--color-sage)" />
              Previous Pet Experience
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6, backgroundColor: 'rgba(255,255,255,0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              {app.previousPetExperience}
            </p>
          </div>
        )}

        {/* Shelter Officer Review Box */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: app.status === 'Approved' ? 'rgba(73, 107, 82, 0.12)' : app.status === 'Rejected' ? 'rgba(209, 67, 67, 0.1)' : 'rgba(217, 133, 91, 0.1)',
            border: `1px solid ${app.status === 'Approved' ? 'rgba(73, 107, 82, 0.25)' : app.status === 'Rejected' ? 'rgba(209, 67, 67, 0.25)' : 'rgba(217, 133, 91, 0.25)'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {app.status === 'Approved' && <CheckCircle2 size={18} color="var(--color-sage)" />}
            {app.status === 'Rejected' && <XCircle size={18} color="#b52828" />}
            {app.status !== 'Approved' && app.status !== 'Rejected' && <Clock size={18} color="var(--color-terracotta)" />}
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              Shelter Review Assessment
            </span>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
            {app.remarks || 'Application has been received by the shelter care team and is awaiting formal assessment.'}
          </p>
          {app.reviewerName && (
            <div style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)' }}>
              Reviewed by: <strong>{app.reviewerName}</strong> {app.reviewedDate && `on ${app.reviewedDate}`}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

export default ApplicationDetailPage;
