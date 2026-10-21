const RescueAlert = require('../models/RescueAlert');

/**
 * createRescueAlert
 * Sequence Diagram 3 - Steps 1 & 2
 */
async function createRescueAlert(req, res, next) {
  try {
    const reporterUserId = req.user ? req.user.userId : req.body.reportedBy;
    const { description, photoURL, latitude, longitude, severity } = req.body;

    if (!description || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Description, latitude, and longitude are required' });
    }

    const result = RescueAlert.createRescueAlerts({
      description,
      photoURL,
      latitude,
      longitude,
      severity: severity || 'Medium',
      reportedBy: reporterUserId
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * assignVolunteer
 * Sequence Diagram 3 - Steps 3 & 4
 */
async function assignVolunteer(req, res, next) {
  try {
    const alertId = Number(req.params.id);
    const volunteerId = req.body.volunteerId;

    if (!volunteerId) {
      return res.status(400).json({ error: 'volunteerId is required' });
    }

    const result = RescueAlert.assignVolunteer(alertId, Number(volunteerId));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * updateRescueAlert
 * Sequence Diagram 3 - Steps 5 & 6
 */
async function updateRescueAlert(req, res, next) {
  try {
    const alertId = Number(req.params.id);
    const result = RescueAlert.updateRescueAlerts(alertId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * completeRescue
 * Sequence Diagram 3 - Steps 7, 8, 9: Complete rescue and close alert
 */
async function completeRescue(req, res, next) {
  try {
    const alertId = Number(req.params.id);
    const result = RescueAlert.completeRescue(alertId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * closeAlert directly
 */
async function closeAlert(req, res, next) {
  try {
    const alertId = Number(req.params.id);
    const updated = RescueAlert.closeAlert(alertId);
    res.json({
      success: true,
      message: `Alert #${alertId} closed`,
      alert: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * listAlerts
 */
async function listAlerts(req, res, next) {
  try {
    const { status, severity, volunteerId } = req.query;
    const alerts = RescueAlert.getAll({
      status,
      severity,
      volunteerId: volunteerId ? Number(volunteerId) : undefined
    });

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (err) {
    next(err);
  }
}

/**
 * getAlertDetails
 */
async function getAlertDetails(req, res, next) {
  try {
    const alertId = Number(req.params.id);
    const alert = RescueAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ error: `RescueAlert #${alertId} not found` });
    }
    res.json({ success: true, alert });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRescueAlert,
  assignVolunteer,
  updateRescueAlert,
  completeRescue,
  closeAlert,
  listAlerts,
  getAlertDetails
};
