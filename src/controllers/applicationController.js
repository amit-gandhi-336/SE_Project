const AdoptionApplication = require('../models/AdoptionApplication');

/**
 * submitApplication
 * Sequence Diagram 1 - Steps 3, 4, 5
 * Adopter submits application for a pet
 */
async function submitApplication(req, res, next) {
  try {
    const adopterId = req.user ? req.user.userId : req.body.adopterId;
    const { petId, applicantDetails, householdDetails, previousPetExperience, remarks } = req.body;

    if (!petId || !adopterId) {
      return res.status(400).json({ error: 'petId and adopterId are required' });
    }

    const application = AdoptionApplication.submitapplications({
      petId: Number(petId),
      adopterId: Number(adopterId),
      applicantDetails: applicantDetails || 'Default applicant profile details',
      householdDetails: householdDetails || 'Standard apartment/house living setup',
      previousPetExperience: previousPetExperience || 'Previous pet care experience',
      remarks: remarks || 'Looking forward to adopting this lovely pet!'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (err) {
    next(err);
  }
}

/**
 * trackApplication
 * Sequence Diagram 1 - Steps 6 & 7
 * Adopter tracks status of submitted application
 */
async function trackApplication(req, res, next) {
  try {
    const applicationId = Number(req.params.id);
    const application = AdoptionApplication.trackapplication(applicationId);

    if (!application) {
      return res.status(404).json({ error: `Application #${applicationId} not found` });
    }

    res.json({
      success: true,
      status: application.status,
      application
    });
  } catch (err) {
    next(err);
  }
}

/**
 * reviewApplication
 * Sequence Diagram 2 - Steps 1 & 2
 * ShelterWorker retrieves and reviews application details
 */
async function reviewApplication(req, res, next) {
  try {
    const applicationId = Number(req.params.id);
    const application = AdoptionApplication.reviewApplication(applicationId);

    res.json({
      success: true,
      applicationDetails: application
    });
  } catch (err) {
    next(err);
  }
}

/**
 * approveApplication
 * Sequence Diagram 2 - Steps 3, 4, 5, 6
 * ShelterWorker approves application -> updates Pet adoption status to 'Adopted'
 */
async function approveApplication(req, res, next) {
  try {
    const applicationId = Number(req.params.id);
    const reviewerUserId = req.user ? req.user.userId : req.body.reviewedBy;
    const { remarks } = req.body;

    const result = AdoptionApplication.approveApplication(
      applicationId,
      reviewerUserId,
      remarks || 'Application approved by Shelter Worker.'
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * rejectApplication
 * Sequence Diagram 2 - Steps 7 & 8
 * ShelterWorker rejects application
 */
async function rejectApplication(req, res, next) {
  try {
    const applicationId = Number(req.params.id);
    const reviewerUserId = req.user ? req.user.userId : req.body.reviewedBy;
    const { remarks } = req.body;

    const result = AdoptionApplication.rejectApplication(
      applicationId,
      reviewerUserId,
      remarks || 'Application rejected by Shelter Worker.'
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * updateApplication
 */
async function updateApplication(req, res, next) {
  try {
    const applicationId = Number(req.params.id);
    const updated = AdoptionApplication.updateApplication(applicationId, req.body);
    res.json({
      success: true,
      message: 'Application updated successfully',
      application: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * listApplications
 */
async function listApplications(req, res, next) {
  try {
    const { adopterId, petId, status } = req.query;
    const applications = AdoptionApplication.getAll({
      adopterId: adopterId ? Number(adopterId) : undefined,
      petId: petId ? Number(petId) : undefined,
      status
    });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitApplication,
  trackApplication,
  reviewApplication,
  approveApplication,
  rejectApplication,
  updateApplication,
  listApplications
};
