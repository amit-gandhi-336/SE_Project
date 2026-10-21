const User = require('./User');
const { getDb } = require('../config/db');

/**
 * ShelterWorker Model (Inherits from User)
 * Attributes: employeeId, designation
 * Methods: addpet()
 */
class ShelterWorker extends User {
  constructor(data = {}) {
    super({ ...data, role: 'ShelterWorker' });
    this.employeeId = data.employeeId || null;
    this.designation = data.designation || '';
  }

  /**
   * Register a ShelterWorker
   * @param {Object} data - { name, email, password, phone, employeeId, designation }
   */
  static register(data) {
    const db = getDb();
    const empId = data.employeeId || Math.floor(100 + Math.random() * 900);

    const existingEmp = db.prepare('SELECT userId FROM shelter_workers WHERE employeeId = ?').get(empId);
    if (existingEmp) {
      throw new Error(`ShelterWorker with employeeId ${empId} already exists`);
    }

    const baseUser = super.register({ ...data, role: 'ShelterWorker' });

    db.prepare(`
      INSERT INTO shelter_workers (userId, employeeId, designation)
      VALUES (?, ?, ?)
    `).run(baseUser.userId, empId, data.designation || 'Animal Care Specialist');

    return super.findById(baseUser.userId);
  }

  /**
   * addpet() method as defined in UML class diagram
   * @param {number} shelterWorkerUserId
   * @param {Object} petData
   * @returns {Object} Newly created pet
   */
  static addpet(shelterWorkerUserId, petData) {
    const Pet = require('./Pet');
    return Pet.createPet({
      ...petData,
      addedBy: shelterWorkerUserId
    });
  }
}

module.exports = ShelterWorker;
