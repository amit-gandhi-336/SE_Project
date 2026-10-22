import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Clock, CheckCircle2, XCircle, Search, Calendar } from 'lucide-react';
import applicationsApi from '../api/applicationsApi';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';

export function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadApplications() {
      setLoading(true);
      setError(null);
      try {
        const res = await applicationsApi.listApplications({ adopterId: user?.userId });
        setApplications(res.applications || []);
      } catch (err) {
        setError(err.message || 'Failed to retrieve adoption applications');
      } finally {
        setLoading(false);
      }
    }

    if (user?.userId) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Visual status progress bar
  const renderProgress = (status) => {
    const isApproved = status === 'Approved';
    const isRejected = status === 'Rejected';
    const isReview = status === 'Under Review' || isApproved || isRejected;

    return (
      <div style={{ marginTop: '1.25rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Connector Line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: '3px',
              backgroundColor: 'rgba(73, 107, 82, 0.15)',
              zIndex: 1
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: isApproved ? 'var(--color-sage)' : isRejected ? '#b52828' : 'var(--color-terracotta)',
                width: isApproved || isRejected ? '100%' : isReview ? '50%' : '0%',
                transition: 'width 0.4s ease'
              }}
            />
          </div>

          {/* Node 1 */}
          <div style={{ zIndex: 2, textAlign: 'center', backgroundColor: 'var(--color-cream)', padding: '0 0.5rem' }}>
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
                margin: '0 auto 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              ✓
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>Submitted</span>
          </div>

          {/* Node 2 */}
          <div style={{ zIndex: 2, textAlign: 'center', backgroundColor: 'var(--color-cream)', padding: '0 0.5rem' }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: isReview ? (isApproved ? 'var(--color-sage)' : isRejected ? '#b52828' : 'var(--color-terracotta)') : 'rgba(0,0,0,0.1)',
                color: isReview ? 'white' : 'var(--color-charcoal-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              2
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isReview ? 'var(--color-charcoal)' : 'var(--color-charcoal-muted)' }}>
              Under Review
            </span>
          </div>

          {/* Node 3 */}
          <div style={{ zIndex: 2, textAlign: 'center', backgroundColor: 'var(--color-cream)', padding: '0 0.5rem' }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: isApproved ? 'var(--color-sage)' : isRejected ? '#b52828' : 'rgba(0,0,0,0.1)',
                color: isApproved || isRejected ? 'white' : 'var(--color-charcoal-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              {isApproved ? '✓' : isRejected ? '✕' : '3'}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isApproved ? 'var(--color-sage)' : isRejected ? '#b52828' : 'var(--color-charcoal-muted)' }}>
              {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Decision'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.3rem', marginBottom: '0.4rem' }}>
          My Adoption Applications
        </h1>
        <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1rem' }}>
          Real-time tracking of your submitted adoption files, shelter review notes, and final decisions.
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner text="Loading your adoption records..." />
      ) : applications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.map((app) => (
            <GlassCard key={app.applicationId} hover padding="1.5rem 1.75rem">
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.35rem', margin: 0 }}>
                      Application #{app.applicationId} — {app.petName || `Pet #${app.petId}`}
                    </h3>
                    <Badge variant={app.status}>{app.status}</Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> Applied on {app.applicationDate}
                    </span>
                    {app.reviewedDate && (
                      <span>• Reviewed: {app.reviewedDate}</span>
                    )}
                  </div>
                </div>

                <Link to={`/applications/${app.applicationId}`}>
                  <Button variant="glass" size="sm" icon={ArrowRight} iconPosition="right">
                    Track Live Details
                  </Button>
                </Link>
              </div>

              {/* Status Timeline */}
              {renderProgress(app.status)}

              {/* Remarks note */}
              {app.remarks && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    color: 'var(--color-charcoal)'
                  }}
                >
                  <strong>Shelter Remarks:</strong> {app.remarks}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={48} color="var(--color-sage)" style={{ margin: '0 auto 1rem', opacity: 0.7 }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
            No Applications Submitted Yet
          </h2>
          <p style={{ color: 'var(--color-charcoal-muted)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            You haven't applied for any pets yet. Browse our available animals and begin your adoption journey today!
          </p>
          <Link to="/pets">
            <Button variant="sage" icon={Search}>
              Browse Available Pets
            </Button>
          </Link>
        </GlassCard>
      )}
    </div>
  );
}

export default MyApplicationsPage;
