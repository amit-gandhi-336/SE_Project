const { getDb } = require('../config/db');
const Pet = require('./Pet');

/**
 * AdoptionApplication Model
 * Attributes: applicationId, applicationDate, status, applicantDetails,
 *             householdDetails, previousPetExperience, remarks, reviewedDate
 * Methods: submitapplications(), updateApplication(), trackapplication(),
 *          approveApplication(), rejectApplication()
 */
class AdoptionApplication {
  constructor(data = {}) {
    this.applicationId = data.applicationId || null;
    this.petId = data.petId || null;
    this.adopterId = data.adopterId || null;
    this.applicationDate = data.applicationDate || new Date().toISOString().split('T')[0];
    this.status = data.status || 'Submitted';
    this.applicantDetails = data.applicantDetails || '';
    this.householdDetails = data.householdDetails || '';
    this.previousPetExperience = data.previousPetExperience || '';
    this.remarks = data.remarks || '';
    this.reviewedDate = data.reviewedDate || null;
    this.reviewedBy = data.reviewedBy || null;
  }

  /**
   * submitapplications()
   * Sequence Diagram 1 - Steps 3, 4, 5
   * Adopter submits adoption application for a Pet
   */
  static submitapplications(data) {
    const db = getDb();

    // Verify pet exists and is available
    const pet = Pet.viewDetails(data.petId);
    if (!pet) {
      throw new Error(`Pet with id ${data.petId} not found`);
    }
    if (pet.adoptionStatus === 'Adopted') {
      throw new Error(`Pet "${pet.name}" has already been adopted`);
    }

    const applicationDate = data.applicationDate || new Date().toISOString().split('T')[0];

    const insert = db.prepare(`
      INSERT INTO adoption_applications (
        petId, adopterId, applicationDate, status,
        applicantDetails, householdDetails, previousPetExperience, remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const res = insert.run(
      data.petId,
      data.adopterId,
      applicationDate,
      'Submitted',
      data.applicantDetails || '',
      data.householdDetails || '',
      data.previousPetExperience || '',
      data.remarks || 'Application received, awaiting initial shelter review'
    );

    const applicationId = Number(res.lastInsertRowid);

    // Call internal updateApplication if needed (Step 4 of Sequence Diagram 1)
    this.updateApplication(applicationId, {
      status: 'Submitted'
    });

    // Optionally set Pet to 'Pending' if not already
    Pet.updateStatus(data.petId, 'Pending');

    return this.trackapplication(applicationId);
  }

  /**
   * updateApplication()
   * Step 4 of Sequence Diagram 1: self-call on AdoptionApplication
   * Can also be used to update details or remarks
   */
  static updateApplication(applicationId, updateData) {
    const db = getDb();
    const app = this.trackapplication(applicationId);
    if (!app) throw new Error(`Application with id ${applicationId} not found`);

    const applicantDetails = updateData.applicantDetails !== undefined ? updateData.applicantDetails : app.applicantDetails;
    const householdDetails = updateData.householdDetails !== undefined ? updateData.householdDetails : app.householdDetails;
    const previousPetExperience = updateData.previousPetExperience !== undefined ? updateData.previousPetExperience : app.previousPetExperience;
    const remarks = updateData.remarks !== undefined ? updateData.remarks : app.remarks;
    const status = updateData.status !== undefined ? updateData.status : app.status;

    db.prepare(`
      UPDATE adoption_applications SET
        applicantDetails = ?,
        householdDetails = ?,
        previousPetExperience = ?,
        remarks = ?,
        status = ?
      WHERE applicationId = ?
    `).run(applicantDetails, householdDetails, previousPetExperience, remarks, status, applicationId);

    return this.trackapplication(applicationId);
  }

  /**
   * trackapplication()
   * Sequence Diagram 1 - Steps 6 & 7: Display application status
   * @param {number} applicationId
   */
  static trackapplication(applicationId) {
    const db = getDb();
    const row = db.prepare(`
      SELECT a.*, 
             p.name as petName, p.species as petSpecies, p.breed as petBreed, p.adoptionStatus as petStatus, p.photoURL as petPhoto,
             u.name as adopterName, u.email as adopterEmail, u.phone as adopterPhone,
             r.name as reviewerName
      FROM adoption_applications a
      JOIN pets p ON a.petId = p.petId
      JOIN users u ON a.adopterId = u.userId
      LEFT JOIN users r ON a.reviewedBy = r.userId
      WHERE a.applicationId = ?
    `).get(applicationId);

    return row || null;
  }

  /**
   * reviewApplication()
   * Sequence Diagram 2 - Steps 1 & 2: ShelterWorker reviews application
   */
  static reviewApplication(applicationId) {
    const app = this.trackapplication(applicationId);
    if (!app) {
      throw new Error(`Application ${applicationId} not found`);
    }

    // Move to 'Under Review' if still 'Submitted'
    if (app.status === 'Submitted') {
      const db = getDb();
      db.prepare(`
        UPDATE adoption_applications
        SET status = 'Under Review'
        WHERE applicationId = ?
      `).run(applicationId);
      return this.trackapplication(applicationId);
    }

    return app;
  }

  /**
   * approveApplication()
   * Sequence Diagram 2 - Steps 3, 4, 5, 6
   * ShelterWorker approves -> Status = Approved -> updateStatus on Pet to 'Adopted'
   * @param {number} applicationId
   * @param {number} shelterWorkerUserId
   * @param {string} remarks
   */
  static approveApplication(applicationId, shelterWorkerUserId, remarks = 'Application approved after shelter review.') {
    const db = getDb();
    const app = this.trackapplication(applicationId);
    if (!app) throw new Error(`Application ${applicationId} not found`);

    const reviewedDate = new Date().toISOString().split('T')[0];

    // Step 4: Status = Approved
    db.prepare(`
      UPDATE adoption_applications SET
        status = 'Approved',
        remarks = ?,
        reviewedDate = ?,
        reviewedBy = ?
      WHERE applicationId = ?
    `).run(remarks, reviewedDate, shelterWorkerUserId || null, applicationId);

    // Step 5: updateStatus on Pet -> Pet Status Updated to 'Adopted'
    const updatedPet = Pet.updateStatus(app.petId, 'Adopted');

    return {
      success: true,
      status: 'Approved',
      message: `Application #${applicationId} approved. Pet "${updatedPet.name}" is now Adopted!`,
      application: this.trackapplication(applicationId),
      pet: updatedPet
    };
  }

  /**
   * rejectApplication()
   * Sequence Diagram 2 - Steps 7 & 8
   * ShelterWorker rejects -> Status = Rejected -> (Pet returns to Available if no other approved app)
   * @param {number} applicationId
   * @param {number} shelterWorkerUserId
   * @param {string} remarks
   */
  static rejectApplication(applicationId, shelterWorkerUserId, remarks = 'Application rejected.') {
    const db = getDb();
    const app = this.trackapplication(applicationId);
    if (!app) throw new Error(`Application ${applicationId} not found`);

    const reviewedDate = new Date().toISOString().split('T')[0];

    // Step 8: Status = Rejected
    db.prepare(`
      UPDATE adoption_applications SET
        status = 'Rejected',
        remarks = ?,
        reviewedDate = ?,
        reviewedBy = ?
      WHERE applicationId = ?
    `).run(remarks, reviewedDate, shelterWorkerUserId || null, applicationId);

    // If pet was 'Pending', return it to 'Available'
    if (app.petStatus === 'Pending') {
      Pet.updateStatus(app.petId, 'Available');
    }

    return {
      success: true,
      status: 'Rejected',
      message: `Application #${applicationId} has been rejected.`,
      application: this.trackapplication(applicationId)
    };
  }

  /**
   * Get all applications with optional filters
   */
  static getAll(filters = {}) {
    const db = getDb();
    let query = `
      SELECT a.*, 
             p.name as petName, p.species as petSpecies, p.breed as petBreed, p.adoptionStatus as petStatus,
             u.name as adopterName, u.email as adopterEmail,
             r.name as reviewerName
      FROM adoption_applications a
      JOIN pets p ON a.petId = p.petId
      JOIN users u ON a.adopterId = u.userId
      LEFT JOIN users r ON a.reviewedBy = r.userId
      WHERE 1=1
    `;
    const params = [];

    if (filters.adopterId) {
      query += ' AND a.adopterId = ?';
      params.push(filters.adopterId);
    }
    if (filters.petId) {
      query += ' AND a.petId = ?';
      params.push(filters.petId);
    }
    if (filters.status) {
      query += ' AND a.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY a.applicationId DESC';
    return db.prepare(query).all(...params);
  }
}

module.exports = AdoptionApplication;
