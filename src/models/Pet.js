const { getDb } = require('../config/db');

/**
 * Pet Model
 * Attributes: petId, name, species, breed, age, gender, size, location,
 *             medicalNeeds, vaccinationStatus, adoptionStatus, description, photoURL
 * Methods: viewDetails(), updateStatus(), sponserPet(), updatePetDetails()
 */
class Pet {
  constructor(data = {}) {
    this.petId = data.petId || null;
    this.name = data.name || '';
    this.species = data.species || '';
    this.breed = data.breed || '';
    this.age = data.age || 0;
    this.gender = data.gender || '';
    this.size = data.size || '';
    this.location = data.location || '';
    this.medicalNeeds = data.medicalNeeds || '';
    this.vaccinationStatus = data.vaccinationStatus || 'Vaccinated';
    this.adoptionStatus = data.adoptionStatus || 'Available';
    this.description = data.description || '';
    this.photoURL = data.photoURL || '';
    this.addedBy = data.addedBy || null;
    this.sponsorCount = data.sponsorCount || 0;
  }

  /**
   * Create a new pet (ShelterWorker addpet flow)
   */
  static createPet(data) {
    const db = getDb();
    const insert = db.prepare(`
      INSERT INTO pets (
        name, species, breed, age, gender, size, location,
        medicalNeeds, vaccinationStatus, adoptionStatus, description, photoURL, addedBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const res = insert.run(
      data.name,
      data.species,
      data.breed,
      Number(data.age) || 1,
      data.gender || 'Unknown',
      data.size || 'Medium',
      data.location || 'Shelter',
      data.medicalNeeds || 'None',
      data.vaccinationStatus || 'Vaccinated',
      data.adoptionStatus || 'Available',
      data.description || '',
      data.photoURL || '',
      data.addedBy || null
    );

    return this.viewDetails(Number(res.lastInsertRowid));
  }

  /**
   * viewDetails() - Retrieve detailed pet information
   * Corresponds to Step 1 & 2 of Sequence Diagram 1
   * @param {number} petId
   */
  static viewDetails(petId) {
    const db = getDb();
    const pet = db.prepare(`
      SELECT p.*, u.name as addedByName
      FROM pets p
      LEFT JOIN users u ON p.addedBy = u.userId
      WHERE p.petId = ?
    `).get(petId);

    if (!pet) return null;
    return pet;
  }

  /**
   * updateStatus() - Updates adoption status ('Available', 'Pending', 'Adopted')
   * Corresponds to Step 5 of Sequence Diagram 2
   * @param {number} petId
   * @param {string} newStatus
   */
  static updateStatus(petId, newStatus) {
    const db = getDb();
    const validStatuses = ['Available', 'Pending', 'Adopted'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status "${newStatus}". Must be one of: ${validStatuses.join(', ')}`);
    }

    const res = db.prepare(`
      UPDATE pets
      SET adoptionStatus = ?
      WHERE petId = ?
    `).run(newStatus, petId);

    if (res.changes === 0) {
      throw new Error(`Pet with id ${petId} not found`);
    }

    return this.viewDetails(petId);
  }

  /**
   * sponserPet() - Sponsor a pet (donations/support)
   * @param {number} petId
   * @param {Object} sponsorInfo - { sponsorName, amount, message }
   */
  static sponserPet(petId, sponsorInfo = {}) {
    const db = getDb();
    const pet = this.viewDetails(petId);
    if (!pet) throw new Error(`Pet with id ${petId} not found`);

    db.prepare(`
      UPDATE pets
      SET sponsorCount = sponsorCount + 1
      WHERE petId = ?
    `).run(petId);

    return {
      success: true,
      message: `Pet ${pet.name} successfully sponsored! Thank you!`,
      sponsorCount: pet.sponsorCount + 1,
      pet: this.viewDetails(petId)
    };
  }

  /**
   * updatePetDetails() - Update pet information
   * @param {number} petId
   * @param {Object} data
   */
  static updatePetDetails(petId, data) {
    const db = getDb();
    const current = this.viewDetails(petId);
    if (!current) throw new Error(`Pet with id ${petId} not found`);

    const updated = {
      name: data.name !== undefined ? data.name : current.name,
      species: data.species !== undefined ? data.species : current.species,
      breed: data.breed !== undefined ? data.breed : current.breed,
      age: data.age !== undefined ? Number(data.age) : current.age,
      gender: data.gender !== undefined ? data.gender : current.gender,
      size: data.size !== undefined ? data.size : current.size,
      location: data.location !== undefined ? data.location : current.location,
      medicalNeeds: data.medicalNeeds !== undefined ? data.medicalNeeds : current.medicalNeeds,
      vaccinationStatus: data.vaccinationStatus !== undefined ? data.vaccinationStatus : current.vaccinationStatus,
      description: data.description !== undefined ? data.description : current.description,
      photoURL: data.photoURL !== undefined ? data.photoURL : current.photoURL
    };

    db.prepare(`
      UPDATE pets SET
        name = ?, species = ?, breed = ?, age = ?, gender = ?,
        size = ?, location = ?, medicalNeeds = ?, vaccinationStatus = ?,
        description = ?, photoURL = ?
      WHERE petId = ?
    `).run(
      updated.name, updated.species, updated.breed, updated.age, updated.gender,
      updated.size, updated.location, updated.medicalNeeds, updated.vaccinationStatus,
      updated.description, updated.photoURL, petId
    );

    return this.viewDetails(petId);
  }

  /**
   * Get all pets with optional filters
   */
  static getAllPets(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM pets WHERE 1=1';
    const params = [];

    if (filters.species) {
      query += ' AND LOWER(species) = LOWER(?)';
      params.push(filters.species);
    }
    if (filters.adoptionStatus) {
      query += ' AND adoptionStatus = ?';
      params.push(filters.adoptionStatus);
    }
    if (filters.search) {
      query += ' AND (name LIKE ? OR breed LIKE ? OR location LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY petId DESC';
    return db.prepare(query).all(...params);
  }
}

module.exports = Pet;
