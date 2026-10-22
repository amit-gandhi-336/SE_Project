import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, FileText, ShieldAlert, CheckCircle2, XCircle, Plus, ArrowRight, Eye, Calendar } from 'lucide-react';
import petsApi from '../api/petsApi';
import applicationsApi from '../api/applicationsApi';
import rescueAlertsApi from '../api/rescueAlertsApi';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';

export function ShelterDashboardPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review & Decision Modal State
  const [reviewApp, setReviewApp] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [decisionSuccess, setDecisionSuccess] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [petsRes, appsRes, alertsRes] = await Promise.all([
        petsApi.listPets(),
        applicationsApi.listApplications(),
        rescueAlertsApi.listAlerts()
      ]);

      setPets(petsRes.pets || []);
      setApplications(appsRes.applications || []);
      setAlerts(alertsRes.alerts || []);
    } catch (err) {
      setError(err.message || 'Failed to load shelter dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleOpenReview = async (app) => {
    setReviewApp(app);
    setRemarks(app.remarks || '');
    setDecisionSuccess('');
    // Automatically marks 'Under Review' on server if it was 'Submitted'
    try {
      await applicationsApi.reviewApplication(app.applicationId);
    } catch (e) {
      console.warn('Review transition note:', e);
    }
  };

  // Approve Application Flow
  const handleApprove = async () => {
    if (!reviewApp) return;
    setActionLoading(true);
    try {
      const res = await applicationsApi.approveApplication(reviewApp.applicationId, {
        reviewedBy: user?.userId,
        remarks: remarks.trim() || 'Verified applicant profile and home environment. Application approved!'
      });
      setDecisionSuccess(res.message || 'Application approved successfully! Pet adoption status updated to Adopted.');
      loadDashboardData();
      setTimeout(() => {
        setReviewApp(null);
      }, 1800);
    } catch (err) {
      alert(err.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Reject Application Flow
  const handleReject = async () => {
    if (!reviewApp) return;
    setActionLoading(true);
    try {
      const res = await applicationsApi.rejectApplication(reviewApp.applicationId, {
        reviewedBy: user?.userId,
        remarks: remarks.trim() || 'Housing conditions or pet requirements not met at this time.'
      });
      setDecisionSuccess(res.message || 'Application rejected.');
      loadDashboardData();
      setTimeout(() => {
        setReviewApp(null);
      }, 1800);
    } catch (err) {
      alert(err.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <LoadingSpinner text="Loading shelter operational metrics..." size="lg" />
      </div>
    );
  }

  const pendingApps = applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review');
  const availablePets = pets.filter(p => p.adoptionStatus === 'Available');
  const activeAlerts = alerts.filter(a => a.status !== 'Closed');

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Shelter Management Hub
          </span>
          <h1 style={{ fontSize: '2.3rem', margin: '0.2rem 0' }}>
            Officer {user?.name?.split(' ')[0]}’s Dashboard
          </h1>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.95rem' }}>
            {user?.designation || 'Animal Care Specialist'} • Employee #{user?.employeeId || '101'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/shelter/pets">
            <Button variant="sage" icon={Plus}>
              Manage & Add Pets
            </Button>
          </Link>
          <Link to="/shelter/applications">
            <Button variant="glass" icon={FileText}>
              All Applications ({applications.length})
            </Button>
          </Link>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />}

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}
      >
        <GlassCard padding="1.5rem">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>Available Pets</span>
            <PawPrint size={20} color="var(--color-sage)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-sage)' }}>
            {availablePets.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', marginTop: '0.2rem' }}>
            Total in shelter: {pets.length}
          </div>
        </GlassCard>

        <GlassCard padding="1.5rem">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>Pending Reviews</span>
            <FileText size={20} color="var(--color-terracotta)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
            {pendingApps.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', marginTop: '0.2rem' }}>
            Awaiting assessment
          </div>
        </GlassCard>

        <GlassCard padding="1.5rem">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>Emergency Alerts</span>
            <ShieldAlert size={20} color="#b52828" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#b52828' }}>
            {activeAlerts.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', marginTop: '0.2rem' }}>
            Active rescue operations
          </div>
        </GlassCard>

        <GlassCard padding="1.5rem">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>Approved Adoptions</span>
            <CheckCircle2 size={20} color="#274567" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#274567' }}>
            {applications.filter(a => a.status === 'Approved').length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', marginTop: '0.2rem' }}>
            Happy forever homes
          </div>
        </GlassCard>
      </div>

      {/* Pending Applications Review Queue */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>
              Adoption Review Queue
            </h2>
            <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Applications requiring immediate shelter evaluation and background checks
            </p>
          </div>
          <Link to="/shelter/applications" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-sage)' }}>
            View Full List ({applications.length}) →
          </Link>
        </div>

        {pendingApps.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingApps.map((app) => (
              <GlassCard key={app.applicationId} padding="1.25rem 1.5rem">
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        Application #{app.applicationId}
                      </span>
                      <Badge variant={app.status}>{app.status}</Badge>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                        Pet: <strong>{app.petName || `Pet #${app.petId}`}</strong>
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: 'var(--color-charcoal-muted)' }}>
                      Applicant: <strong>{app.adopterName || `User #${app.adopterId}`}</strong> ({app.adopterEmail || 'N/A'}) • Filed on {app.applicationDate}
                    </div>
                  </div>

                  <Button
                    variant="sage"
                    size="sm"
                    icon={Eye}
                    onClick={() => handleOpenReview(app)}
                  >
                    Review Application
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard style={{ textAlign: 'center', padding: '2.5rem' }}>
            <CheckCircle2 size={36} color="var(--color-sage)" style={{ margin: '0 auto 0.75rem', opacity: 0.8 }} />
            <p style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>
              All caught up! No pending applications requiring review.
            </p>
          </GlassCard>
        )}
      </section>

      {/* Review Modal Flow */}
      <Modal
        isOpen={!!reviewApp}
        onClose={() => setReviewApp(null)}
        title={`Review Application #${reviewApp?.applicationId}`}
        maxWidth="650px"
      >
        {decisionSuccess ? (
          <AlertBanner type="success" message={decisionSuccess} />
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(230,239,229,0.5)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-sage)', fontWeight: 700, textTransform: 'uppercase' }}>Pet Target</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{reviewApp?.petName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)' }}>{reviewApp?.petSpecies} • {reviewApp?.petBreed}</div>
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
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>Household & Living Environment</span>
              <p style={{ fontSize: '0.92rem', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.06)' }}>
                {reviewApp?.householdDetails || 'Not specified'}
              </p>
            </div>

            {reviewApp?.previousPetExperience && (
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>Previous Pet Experience</span>
                <p style={{ fontSize: '0.92rem', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {reviewApp.previousPetExperience}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Shelter Officer Remarks / Conditions *
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter approval conditions or rejection notes..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Decision Buttons */}
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

export default ShelterDashboardPage;
