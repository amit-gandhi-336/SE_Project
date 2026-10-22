import React, { useState, useEffect, useCallback } from 'react';
import { Eye, CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import applicationsApi from '../api/applicationsApi';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';

export function ShelterApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal State
  const [reviewApp, setReviewApp] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationsApi.listApplications({
        status: statusFilter !== 'All' ? statusFilter : undefined
      });
      setApplications(res.applications || []);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenReview = async (app) => {
    setReviewApp(app);
    setRemarks(app.remarks || '');
    setFeedback(null);
    try {
      await applicationsApi.reviewApplication(app.applicationId);
    } catch (e) {
      console.warn('Transition note:', e);
    }
  };

  const handleApprove = async () => {
    if (!reviewApp) return;
    setActionLoading(true);
    try {
      const res = await applicationsApi.approveApplication(reviewApp.applicationId, {
        reviewedBy: user?.userId,
        remarks: remarks.trim() || 'Application approved by Shelter Care Officer.'
      });
      setFeedback({ type: 'success', message: res.message || 'Application approved! Pet status updated to Adopted.' });
      fetchApplications();
      setTimeout(() => setReviewApp(null), 1800);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Approval failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reviewApp) return;
    setActionLoading(true);
    try {
      const res = await applicationsApi.rejectApplication(reviewApp.applicationId, {
        reviewedBy: user?.userId,
        remarks: remarks.trim() || 'Application rejected by Shelter Care Officer.'
      });
      setFeedback({ type: 'success', message: res.message || 'Application rejected.' });
      fetchApplications();
      setTimeout(() => setReviewApp(null), 1800);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Rejection failed' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase' }}>
          Shelter Review Station
        </span>
        <h1 style={{ fontSize: '2.2rem', margin: '0.2rem 0' }}>
          All Adoption Applications
        </h1>
        <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.95rem' }}>
          Evaluate applicant suitability, inspect household environments, and approve or reject adoption requests.
        </p>
      </div>

      {/* Filter Tabs */}
      <GlassCard padding="0.85rem 1.25rem" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Submitted', 'Under Review', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: statusFilter === st ? '1px solid var(--color-sage)' : '1px solid rgba(0,0,0,0.1)',
                backgroundColor: statusFilter === st ? 'var(--color-sage)' : 'white',
                color: statusFilter === st ? 'white' : 'var(--color-charcoal)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </GlassCard>

      {error && <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner text="Retrieving applications..." />
      ) : applications.length > 0 ? (
        <GlassCard padding="1.5rem" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(73, 107, 82, 0.15)', color: 'var(--color-charcoal-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>App ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Target Pet</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Applicant</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Filing Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.applicationId} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>
                      #{app.applicationId}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{app.petName || `Pet #${app.petId}`}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-charcoal-muted)' }}>{app.petSpecies} • {app.petBreed}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{app.adopterName || `User #${app.adopterId}`}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-charcoal-muted)' }}>{app.adopterEmail}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                      {app.applicationDate}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Badge variant={app.status}>{app.status}</Badge>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <Button
                        variant="sage"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleOpenReview(app)}
                      >
                        Inspect & Decide
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ) : (
        <GlassCard style={{ textAlign: 'center', padding: '3.5rem' }}>
          <p style={{ color: 'var(--color-charcoal-muted)' }}>No applications found matching the selected filter.</p>
        </GlassCard>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewApp}
        onClose={() => setReviewApp(null)}
        title={`Review Application #${reviewApp?.applicationId}`}
        maxWidth="650px"
      >
        {feedback ? (
          <AlertBanner type={feedback.type} message={feedback.message} />
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(230,239,229,0.5)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-sage)', fontWeight: 700, textTransform: 'uppercase' }}>Pet Target</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{reviewApp?.petName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)' }}>Status: {reviewApp?.petStatus}</div>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(217,133,91,0.08)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-terracotta)', fontWeight: 700, textTransform: 'uppercase' }}>Applicant</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{reviewApp?.adopterName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)' }}>{reviewApp?.adopterEmail}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>Applicant Profile</span>
              <p style={{ fontSize: '0.92rem', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.06)' }}>
                {reviewApp?.applicantDetails || 'Not specified'}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>Household Details</span>
              <p style={{ fontSize: '0.92rem', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.06)' }}>
                {reviewApp?.householdDetails || 'Not specified'}
              </p>
            </div>

            {reviewApp?.previousPetExperience && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>Previous Pet Experience</span>
                <p style={{ fontSize: '0.92rem', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {reviewApp.previousPetExperience}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Shelter Officer Remarks *
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Approval conditions or rejection rationale..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button
                variant="danger"
                icon={XCircle}
                loading={actionLoading}
                onClick={handleReject}
              >
                Reject Application
              </Button>
              <Button
                variant="sage"
                icon={CheckCircle2}
                loading={actionLoading}
                onClick={handleApprove}
              >
                Approve & Mark Pet Adopted
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ShelterApplicationsPage;
