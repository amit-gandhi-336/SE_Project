import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, MapPin, UserCheck, Clock, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import rescueAlertsApi from '../api/rescueAlertsApi';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';

export function VolunteerDashboardPage() {
  const { user } = useAuth();
  const [assignedAlerts, setAssignedAlerts] = useState([]);
  const [unassignedAlerts, setUnassignedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rescueAlertsApi.listAlerts();
      const allAlerts = res.alerts || [];

      // Filter assigned to this volunteer
      setAssignedAlerts(allAlerts.filter(a => a.volunteerId === user?.userId));
      // Filter unassigned and still open
      setUnassignedAlerts(allAlerts.filter(a => !a.volunteerId && a.status === 'Reported'));
    } catch (err) {
      setError(err.message || 'Failed to load volunteer missions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [user]);

  const handleAssignToMe = async (alertId) => {
    setActionLoadingId(alertId);
    try {
      const res = await rescueAlertsApi.assignVolunteer(alertId, user.userId);
      setFeedback({ type: 'success', message: res.message || 'Mission assigned to your squad!' });
      loadAlerts();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Assignment failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSetInProgress = async (alertId) => {
    setActionLoadingId(alertId);
    try {
      await rescueAlertsApi.updateRescueAlert(alertId, { status: 'In Progress' });
      setFeedback({ type: 'success', message: `Alert #${alertId} marked In Progress` });
      loadAlerts();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Update failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteRescue = async (alertId) => {
    setActionLoadingId(alertId);
    try {
      const res = await rescueAlertsApi.completeRescue(alertId);
      setFeedback({ type: 'success', message: res.message || `Mission #${alertId} successfully completed and closed!` });
      loadAlerts();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Completion failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <LoadingSpinner text="Connecting to Volunteer Dispatch..." size="lg" />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Header Profile Badge */}
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
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#274567', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Volunteer Rescue Squad
          </span>
          <h1 style={{ fontSize: '2.3rem', margin: '0.2rem 0' }}>
            Responder {user?.name?.split(' ')[0]}’s Station
          </h1>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.95rem' }}>
            Badge #{user?.volunteerId || '501'} • Sector: {user?.serviceArea || 'Mumbai Metro'} • Availability: {user?.availability || 'On-Call'}
          </p>
        </div>

        <GlassCard
          padding="0.85rem 1.4rem"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>
              My Active Tasks
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-sage)' }}>
              {assignedAlerts.filter(a => a.status !== 'Closed').length}
            </div>
          </div>
          <div style={{ width: 1, height: 28, backgroundColor: 'rgba(0,0,0,0.1)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>
              Completed
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#274567' }}>
              {assignedAlerts.filter(a => a.status === 'Closed').length}
            </div>
          </div>
        </GlassCard>
      </div>

      {feedback && (
        <AlertBanner
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}
      {error && <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />}

      {/* Section 1: Assigned Rescue Missions */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.2rem' }}>
          My Assigned Rescue Tasks ({assignedAlerts.length})
        </h2>

        {assignedAlerts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {assignedAlerts.map((alert) => (
              <GlassCard key={alert.alertId} hover padding="1.5rem">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                      Mission #{alert.alertId}
                    </span>
                    <Badge variant={alert.severity}>{alert.severity} Severity</Badge>
                    <Badge variant={alert.status}>{alert.status}</Badge>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)' }}>
                    Reported on {alert.reportedDate}
                  </span>
                </div>

                <p style={{ fontSize: '0.98rem', color: 'var(--color-charcoal)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                  {alert.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', marginBottom: '1.25rem' }}>
                  <MapPin size={15} color="var(--color-sage)" />
                  <span>GPS Location: <strong>{alert.latitude}° N, {alert.longitude}° E</strong></span>
                </div>

                {alert.status !== 'Closed' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(73, 107, 82, 0.12)' }}>
                    {alert.status === 'Assigned' && (
                      <Button
                        variant="terracotta"
                        size="sm"
                        loading={actionLoadingId === alert.alertId}
                        onClick={() => handleSetInProgress(alert.alertId)}
                      >
                        Departing: Set In Progress
                      </Button>
                    )}

                    <Button
                      variant="sage"
                      size="sm"
                      icon={CheckCircle2}
                      loading={actionLoadingId === alert.alertId}
                      onClick={() => handleCompleteRescue(alert.alertId)}
                    >
                      Complete Rescue & Close Alert
                    </Button>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-charcoal-muted)' }}>
              You currently have no assigned rescue missions. Inspect unassigned alerts below to accept one.
            </p>
          </GlassCard>
        )}
      </section>

      {/* Section 2: Unassigned Emergency Alerts Needing Responders */}
      <section>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.2rem' }}>
          Open Unassigned Incidents ({unassignedAlerts.length})
        </h2>

        {unassignedAlerts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {unassignedAlerts.map((alert) => (
              <GlassCard key={alert.alertId} hover padding="1.5rem" style={{ borderLeft: '4px solid var(--color-terracotta)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>
                      Alert #{alert.alertId}
                    </span>
                    <Badge variant={alert.severity}>{alert.severity} Severity</Badge>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)' }}>
                    Reported on {alert.reportedDate}
                  </span>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--color-charcoal)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                  {alert.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                    <MapPin size={15} color="var(--color-sage)" />
                    <span>Coordinates: {alert.latitude}° N, {alert.longitude}° E</span>
                  </div>

                  <Button
                    variant="terracotta"
                    size="sm"
                    icon={UserCheck}
                    loading={actionLoadingId === alert.alertId}
                    onClick={() => handleAssignToMe(alert.alertId)}
                  >
                    Accept Mission
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-charcoal-muted)' }}>
              No unassigned rescue alerts at this time. All reported incidents are actively covered!
            </p>
          </GlassCard>
        )}
      </section>
    </div>
  );
}

export default VolunteerDashboardPage;
