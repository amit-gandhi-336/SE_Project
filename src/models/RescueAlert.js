const { getDb } = require('../config/db');

/**
 * RescueAlert Model
 * Attributes: alertId, description, photoURL, latitude, longitude,
 *             severity, status, reportedDate
 * Methods: createRescueAlerts(), assignVolunteer(), updateRescueAlerts(),
 *          completeRescue(), closeAlert()
 */
class RescueAlert {
  constructor(data = {}) {
    this.alertId = data.alertId || null;
    this.description = data.description || '';
    this.photoURL = data.photoURL || '';
    this.latitude = data.latitude || 0.0;
    this.longitude = data.longitude || 0.0;
    this.severity = data.severity || 'Medium';
    this.status = data.status || 'Reported';
    this.reportedDate = data.reportedDate || new Date().toISOString();
    this.reportedBy = data.reportedBy || null;
    this.volunteerId = data.volunteerId || null;
  }

  /**
   * createRescueAlerts()
   * Sequence Diagram 3 - Steps 1 & 2
   * @param {Object} data - { description, photoURL, latitude, longitude, severity, reportedBy }
   */
  static createRescueAlerts(data) {
    const db = getDb();
    const reportedDate = data.reportedDate || new Date().toISOString().replace('T', ' ').substring(0, 19);

    const insert = db.prepare(`
      INSERT INTO rescue_alerts (
        description, photoURL, latitude, longitude, severity, status, reportedDate, reportedBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const res = insert.run(
      data.description,
      data.photoURL || '',
      Number(data.latitude) || 0.0,
      Number(data.longitude) || 0.0,
      data.severity || 'Medium',
      'Reported',
      reportedDate,
      data.reportedBy || null
    );

    const alertId = Number(res.lastInsertRowid);
    return {
      success: true,
      message: 'Alert created successfully',
      alert: this.findById(alertId)
    };
  }

  /**
   * assignVolunteer()
   * Sequence Diagram 3 - Steps 3 & 4
   * @param {number} alertId
   * @param {number} volunteerUserId
   */
  static assignVolunteer(alertId, volunteerUserId) {
    const db = getDb();
    const alert = this.findById(alertId);
    if (!alert) throw new Error(`RescueAlert #${alertId} not found`);

    // Verify volunteer exists
    const vol = db.prepare('SELECT u.name, v.volunteerId FROM users u JOIN volunteers v ON u.userId = v.userId WHERE u.userId = ?').get(volunteerUserId);
    if (!vol) throw new Error(`Volunteer user #${volunteerUserId} not found`);

    db.prepare(`
      UPDATE rescue_alerts
      SET volunteerId = ?, status = 'Assigned'
      WHERE alertId = ?
    `).run(volunteerUserId, alertId);

    const updated = this.findById(alertId);
    return {
      success: true,
      message: `Volunteer ${vol.name} assigned to alert #${alertId}`,
      alert: updated
    };
  }

  /**
   * updateRescueAlerts()
   * Sequence Diagram 3 - Steps 5 & 6
   * @param {number} alertId
   * @param {Object} updateData
   */
  static updateRescueAlerts(alertId, updateData) {
    const db = getDb();
    const current = this.findById(alertId);
    if (!current) throw new Error(`RescueAlert #${alertId} not found`);

    const description = updateData.description !== undefined ? updateData.description : current.description;
    const severity = updateData.severity !== undefined ? updateData.severity : current.severity;
    const status = updateData.status !== undefined ? updateData.status : current.status;
    const photoURL = updateData.photoURL !== undefined ? updateData.photoURL : current.photoURL;

    db.prepare(`
      UPDATE rescue_alerts SET
        description = ?,
        severity = ?,
        status = ?,
        photoURL = ?
      WHERE alertId = ?
    `).run(description, severity, status, photoURL, alertId);

    const updated = this.findById(alertId);
    return {
      success: true,
      message: `Rescue alert #${alertId} updated`,
      alert: updated
    };
  }

  /**
   * completeRescue()
   * Sequence Diagram 3 - Steps 7, 8, 9
   * Marks rescue completed and calls internal closeAlert()
   * @param {number} alertId
   */
  static completeRescue(alertId) {
    const db = getDb();
    const alert = this.findById(alertId);
    if (!alert) throw new Error(`RescueAlert #${alertId} not found`);

    // Complete the rescue
    db.prepare(`
      UPDATE rescue_alerts
      SET status = 'Completed'
      WHERE alertId = ?
    `).run(alertId);

    // Step 8: closeAlert (internal self call)
    this.closeAlert(alertId);

    const finalAlert = this.findById(alertId);
    return {
      success: true,
      message: 'Rescue Completed and Alert closed successfully',
      status: finalAlert.status,
      alert: finalAlert
    };
  }

  /**
   * closeAlert()
   * Sequence Diagram 3 - Step 8
   * @param {number} alertId
   */
  static closeAlert(alertId) {
    const db = getDb();
    const res = db.prepare(`
      UPDATE rescue_alerts
      SET status = 'Closed'
      WHERE alertId = ?
    `).run(alertId);

    return this.findById(alertId);
  }

  /**
   * findById()
   * @param {number} alertId
   */
  static findById(alertId) {
    const db = getDb();
    const alert = db.prepare(`
      SELECT r.*,
             u.name as reportedByName, u.phone as reportedByPhone,
             v.name as volunteerName, v.phone as volunteerPhone,
             vol.serviceArea, vol.volunteerId as volunteerBadgeNo
      FROM rescue_alerts r
      LEFT JOIN users u ON r.reportedBy = u.userId
      LEFT JOIN users v ON r.volunteerId = v.userId
      LEFT JOIN volunteers vol ON r.volunteerId = vol.userId
      WHERE r.alertId = ?
    `).get(alertId);

    return alert || null;
  }

  /**
   * getAll() - List all alerts
   */
  static getAll(filters = {}) {
    const db = getDb();
    let query = `
      SELECT r.*,
             u.name as reportedByName,
             v.name as volunteerName,
             vol.volunteerId as volunteerBadgeNo
      FROM rescue_alerts r
      LEFT JOIN users u ON r.reportedBy = u.userId
      LEFT JOIN users v ON r.volunteerId = v.userId
      LEFT JOIN volunteers vol ON r.volunteerId = vol.userId
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND r.status = ?';
      params.push(filters.status);
    }
    if (filters.severity) {
      query += ' AND r.severity = ?';
      params.push(filters.severity);
    }
    if (filters.volunteerId) {
      query += ' AND r.volunteerId = ?';
      params.push(filters.volunteerId);
    }

    query += ' ORDER BY r.alertId DESC';
    return db.prepare(query).all(...params);
  }
}

module.exports = RescueAlert;
