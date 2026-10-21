const User = require('./User');
const { getDb } = require('../config/db');

/**
 * Adopter Model (Inherits from User)
 * Attribute: adoptionPreferences
 */
class Adopter extends User {
  constructor(data = {}) {
    super({ ...data, role: 'Adopter' });
    this.adoptionPreferences = data.adoptionPreferences || '';
  }

  /**
   * Register an Adopter
   * @param {Object} data - { name, email, password, phone, adoptionPreferences }
   */
  static register(data) {
    const baseUser = super.register({ ...data, role: 'Adopter' });
    const db = getDb();

    db.prepare(`
      INSERT INTO adopters (userId, adoptionPreferences)
      VALUES (?, ?)
    `).run(baseUser.userId, data.adoptionPreferences || '');

    return super.findById(baseUser.userId);
  }

  /**
   * Update adopter specific preferences
   */
  static updatePreferences(userId, adoptionPreferences) {
    const db = getDb();
    db.prepare(`
      UPDATE adopters SET adoptionPreferences = ? WHERE userId = ?
    `).run(adoptionPreferences, userId);
    return super.findById(userId);
  }
}

module.exports = Adopter;
