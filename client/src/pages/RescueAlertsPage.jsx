import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Plus, MapPin, AlertTriangle, CheckCircle2, Clock, Check, UserCheck } from 'lucide-react';
import rescueAlertsApi from '../api/rescueAlertsApi';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';

export function RescueAlertsPage() {
  const { user, isAuthenticated, isVolunteer, isShelterWorker } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  // Report Form Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [latitude, setLatitude] = useState('19.1234');
  const [longitude, setLongitude] = useState('72.8361');
  const [severity, setSeverity] = useState('High');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');
  const [reportError, setReportError] = useState('');

  // Action status loading
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rescueAlertsApi.listAlerts({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        severity: severityFilter !== 'All' ? severityFilter : undefined
      });
      setAlerts(res.alerts || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch rescue alerts');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, severityFilter]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Geolocation auto-detect helper
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(4));
          setLongitude(pos.coords.longitude.toFixed(4));
        },
        () => {
          // Default fallback (Mumbai Andheri area)
          setLatitude('19.1234');
          setLongitude('72.8361');
        }
      );
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !latitude || !longitude) {
      setReportError('Description and GPS coordinates are required.');
      return;
    }

    setSubmittingReport(true);
    setReportError('');
    try {
      const res = await rescueAlertsApi.createRescueAlert({
        description: description.trim(),
        photoURL: photoURL.trim() || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        severity,
        reportedBy: user?.userId || null
      });

      setReportSuccess(res.message || 'Rescue alert reported successfully! Volunteer squads have been alerted.');
      setDescription('');
      setPhotoURL('');
      fetchAlerts();
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSuccess('');
      }, 2000);
    } catch (err) {
      setReportError(err.message || 'Failed to file emergency report');
    } finally {
      setSubmittingReport(false);
    }
  };

  // Volunteer quick actions
  const handleAssignToMe = async (alertId) => {
    if (!user?.userId) return;
    setActionLoadingId(alertId);
    try {
      await rescueAlertsApi.assignVolunteer(alertId, user.userId);
      fetchAlerts();
    } catch (err) {
      alert(err.message || 'Assignment failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateStatus = async (alertId, newStatus) => {
    setActionLoadingId(alertId);
    try {
      await rescueAlertsApi.updateRescueAlert(alertId, { status: newStatus });
      fetchAlerts();
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteRescue = async (alertId) => {
    setActionLoadingId(alertId);
    try {
      await rescueAlertsApi.completeRescue(alertId);
      fetchAlerts();
    } catch (err) {
      alert(err.message || 'Completion failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', minHeight: '80vh' }}>
      {/* Top Banner */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-terracotta)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            <ShieldAlert size={16} /> 24/7 Animal Emergency Response
          </div>
          <h1 style={{ fontSize: '2.3rem', margin: 0 }}>
            Live Rescue Alerts
          </h1>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.98rem', marginTop: '0.3rem' }}>
            Report stranded or injured animals in real-time. Volunteer responders coordinate immediate triage and shelter intake.
          </p>
        </div>

        <Button
          variant="terracotta"
          size="lg"
          icon={Plus}
          onClick={() => {
            setReportError('');
            setReportSuccess('');
            setReportModalOpen(true);
          }}
        >
          Report an Animal in Need
        </Button>
      </div>

      {/* Filter Row */}
      <GlassCard padding="1rem 1.5rem" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>Status:</span>
            {['All', 'Reported', 'Assigned', 'In Progress', 'Completed', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: statusFilter === st ? '1px solid var(--color-sage)' : '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: statusFilter === st ? 'var(--color-sage)' : 'white',
                  color: statusFilter === st ? 'white' : 'var(--color-charcoal)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>Severity:</span>
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: severityFilter === sev ? '1px solid var(--color-terracotta)' : '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: severityFilter === sev ? 'var(--color-terracotta)' : 'white',
                  color: severityFilter === sev ? 'white' : 'var(--color-charcoal)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {error && <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />}

      {/* Alerts List */}
      {loading ? (
        <LoadingSpinner text="Loading active rescue alerts..." />
      ) : alerts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {alerts.map((alert) => (
            <GlassCard key={alert.alertId} hover padding="1.5rem 1.75rem">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: alert.photoURL ? '160px 1fr' : '1fr',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                {alert.photoURL && (
                  <div
                    style={{
                      height: '140px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <img
                      src={alert.photoURL}
                      alt="Rescue animal"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
                      Alert #{alert.alertId}
                    </h3>
                    <Badge variant={alert.severity}>{alert.severity} Severity</Badge>
                    <Badge variant={alert.status}>{alert.status}</Badge>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', marginLeft: 'auto' }}>
                      Reported: {alert.reportedDate}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.96rem', color: 'var(--color-charcoal)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {alert.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} color="var(--color-sage)" />
                      <span>GPS: {alert.latitude}° N, {alert.longitude}° E</span>
                    </div>

                    {alert.volunteerName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <UserCheck size={15} color="var(--color-sage)" />
                        <span>Assigned Volunteer: <strong>{alert.volunteerName}</strong></span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-terracotta)', fontWeight: 600 }}>
                        • Unassigned Volunteer
                      </span>
                    )}
                  </div>

                  {/* Actions for Volunteers and Shelter Workers */}
                  {(isVolunteer || isShelterWorker) && alert.status !== 'Closed' && (
                    <div
                      style={{
                        marginTop: '1.25rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(73, 107, 82, 0.12)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.6rem'
                      }}
                    >
                      {!alert.volunteerId && isVolunteer && (
                        <Button
                          variant="sage"
                          size="sm"
                          icon={UserCheck}
                          loading={actionLoadingId === alert.alertId}
                          onClick={() => handleAssignToMe(alert.alertId)}
                        >
                          Accept & Assign to Me
                        </Button>
                      )}

                      {alert.status === 'Assigned' && (
                        <Button
                          variant="terracotta"
                          size="sm"
                          loading={actionLoadingId === alert.alertId}
                          onClick={() => handleUpdateStatus(alert.alertId, 'In Progress')}
                        >
                          Set Status to In Progress
                        </Button>
                      )}

                      {(alert.status === 'In Progress' || alert.status === 'Assigned') && (
                        <Button
                          variant="glass"
                          size="sm"
                          icon={CheckCircle2}
                          loading={actionLoadingId === alert.alertId}
                          onClick={() => handleCompleteRescue(alert.alertId)}
                        >
                          Complete Rescue & Close Alert
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShieldAlert size={48} color="var(--color-sage)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            No Active Rescue Alerts Found
          </h2>
          <p style={{ color: 'var(--color-charcoal-muted)' }}>
            All reported rescues have either been completed or none match the selected filter.
          </p>
        </GlassCard>
      )}

      {/* Report Animal in Need Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report an Animal in Need"
        maxWidth="600px"
      >
        {reportSuccess ? (
          <AlertBanner type="success" message={reportSuccess} />
        ) : (
          <form onSubmit={handleReportSubmit}>
            {reportError && <AlertBanner type="error" message={reportError} onDismiss={() => setReportError('')} />}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Incident Description *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe the animal, injury severity, landmarks, and immediate surroundings..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Incident GPS Coordinates *
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-sage)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <MapPin size={13} /> Detect Device Location
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Latitude</span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(73, 107, 82, 0.3)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>Longitude</span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(73, 107, 82, 0.3)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Urgency / Severity Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {['Low', 'Medium', 'High', 'Critical'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: severity === s ? '2px solid var(--color-terracotta)' : '1px solid rgba(0,0,0,0.15)',
                      backgroundColor: severity === s ? 'rgba(217, 133, 91, 0.15)' : 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                Photo URL (Web image reference)
              </label>
              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-charcoal-muted)', marginBottom: '0.4rem' }}>
                Paste a public image link or leave blank to use shelter incident placeholder
              </span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="glass" onClick={() => setReportModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="terracotta" type="submit" loading={submittingReport} icon={ShieldAlert}>
                Broadcast Emergency Alert
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default RescueAlertsPage;
