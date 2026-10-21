const User = require('./User');
const { getDb } = require('../config/db');

/**
 * Volunteer Model (Inherits from User)
 * Attributes: volunteerId, availability, serviceArea
 */
class Volunteer extends User {
  constructor(data = {}) {
    super({ ...data, role: 'Volunteer' });
    this.volunteerId = data.volunteerId || null;
    this.availability = data.availability || '';
    this.serviceArea = data.serviceArea || '';
  }

  /**
   * Register a Volunteer
   * @param {Object} data - { name, email, password, phone, volunteerId, availability, serviceArea }
   */
  static register(data) {
    const db = getDb();
    const volId = data.volunteerId || Math.floor(500 + Math.random() * 500);

    const existingVol = db.prepare('SELECT userId FROM volunteers WHERE volunteerId = ?').get(volId);
    if (existingVol) {
      throw new Error(`Volunteer with volunteerId ${volId} already exists`);
    }

    const baseUser = super.register({ ...data, role: 'Volunteer' });

    db.prepare(`
      INSERT INTO volunteers (userId, volunteerId, availability, serviceArea)
      VALUES (?, ?, ?, ?)
    `).run(
      baseUser.userId,
      volId,
      data.availability || 'Weekends & On-Call',
      data.serviceArea || 'General Metro Region'
    );

    return super.findById(baseUser.userId);
  }

  /**
   * List all volunteers
   */
  static listAll() {
    const db = getDb();
    return db.prepare(`
      SELECT u.userId, u.name, u.email, u.phone, u.role,
             v.volunteerId, v.availability, v.serviceArea
      FROM users u
      JOIN volunteers v ON u.userId = v.userId
    `).all();
  }
}

module.exports = Volunteer;
