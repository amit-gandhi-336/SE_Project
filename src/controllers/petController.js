const Pet = require('../models/Pet');
const ShelterWorker = require('../models/ShelterWorker');

/**
 * List all pets
 */
async function listPets(req, res, next) {
  try {
    const { species, adoptionStatus, search } = req.query;
    const pets = Pet.getAllPets({ species, adoptionStatus, search });
    res.json({
      success: true,
      count: pets.length,
      pets
    });
  } catch (err) {
    next(err);
  }
}

/**
 * viewDetails(petId)
 * Sequence Diagram 1 - Steps 1 & 2: Adopter views pet details
 */
async function viewDetails(req, res, next) {
  try {
    const petId = Number(req.params.id);
    const pet = Pet.viewDetails(petId);
    if (!pet) {
      return res.status(404).json({ error: `Pet #${petId} not found` });
    }
    res.json({
      success: true,
      pet
    });
  } catch (err) {
    next(err);
  }
}

/**
 * addPet()
 * ShelterWorker adds a pet to inventory
 */
async function addPet(req, res, next) {
  try {
    const workerUserId = req.user ? req.user.userId : req.body.addedBy;
    const petData = req.body;

    if (!petData.name || !petData.species || !petData.breed) {
      return res.status(400).json({ error: 'Name, species, and breed are required' });
    }

    const createdPet = ShelterWorker.addpet(workerUserId, petData);
    res.status(201).json({
      success: true,
      message: `Pet "${createdPet.name}" added successfully to shelter inventory`,
      pet: createdPet
    });
  } catch (err) {
    next(err);
  }
}

/**
 * updateStatus(petId, newStatus)
 * Sequence Diagram 2 - Step 5 & 6
 */
async function updateStatus(req, res, next) {
  try {
    const petId = Number(req.params.id);
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required (Available, Pending, Adopted)' });
    }

    const updatedPet = Pet.updateStatus(petId, status);
    res.json({
      success: true,
      message: `Pet status updated to "${status}"`,
      pet: updatedPet
    });
  } catch (err) {
    next(err);
  }
}

/**
 * updatePetDetails(petId)
 */
async function updatePetDetails(req, res, next) {
  try {
    const petId = Number(req.params.id);
    const updatedPet = Pet.updatePetDetails(petId, req.body);
    res.json({
      success: true,
      message: 'Pet details updated successfully',
      pet: updatedPet
    });
  } catch (err) {
    next(err);
  }
}

/**
 * sponserPet(petId)
 */
async function sponsorPet(req, res, next) {
  try {
    const petId = Number(req.params.id);
    const result = Pet.sponserPet(petId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listPets,
  viewDetails,
  addPet,
  updateStatus,
  updatePetDetails,
  sponsorPet
};
