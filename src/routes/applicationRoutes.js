const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { optionalAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit adoption application (submitapplications() - Sequence Diagram 1 Steps 3-5)
 *     tags: [Adoption Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - petId
 *               - adopterId
 *             properties:
 *               petId:
 *                 type: integer
 *                 example: 1
 *               adopterId:
 *                 type: integer
 *                 example: 2
 *               applicantDetails:
 *                 type: string
 *                 example: Priya Sharma, Senior Software Engineer
 *               householdDetails:
 *                 type: string
 *                 example: 3 BHK apartment with private balcony
 *               previousPetExperience:
 *                 type: string
 *                 example: 7 years caring for family dogs
 *               remarks:
 *                 type: string
 *                 example: Excited to welcome Buddy into our home!
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *   get:
 *     summary: List all applications (filterable by status, adopterId, petId)
 *     tags: [Adoption Applications]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Submitted, Under Review, Approved, Rejected]
 *       - in: query
 *         name: adopterId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: petId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of adoption applications
 */
router.post('/', optionalAuth, applicationController.submitApplication);
router.get('/', applicationController.listApplications);

/**
 * @swagger
 * /api/applications/{id}/track:
 *   get:
 *     summary: Track application status (trackapplication() - Sequence Diagram 1 Steps 6-7)
 *     tags: [Adoption Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Current application status and details
 *       404:
 *         description: Application not found
 */
router.get('/:id/track', applicationController.trackApplication);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Review application details (reviewApplication() - Sequence Diagram 2 Steps 1-2)
 *     tags: [Adoption Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details for shelter review
 *   put:
 *     summary: Update application details (updateApplication() in UML)
 *     tags: [Adoption Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicantDetails: { type: string }
 *               householdDetails: { type: string }
 *               previousPetExperience: { type: string }
 *               remarks: { type: string }
 *     responses:
 *       200:
 *         description: Application updated
 */
router.get('/:id', applicationController.reviewApplication);
router.put('/:id', optionalAuth, applicationController.updateApplication);

/**
 * @swagger
 * /api/applications/{id}/approve:
 *   post:
 *     summary: Approve adoption application (approveApplication() - Sequence Diagram 2 Steps 3-6)
 *     description: Shelter worker approves application; automatically triggers Pet.updateStatus('Adopted')
 *     tags: [Adoption Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewedBy:
 *                 type: integer
 *                 description: ShelterWorker userId
 *                 example: 1
 *               remarks:
 *                 type: string
 *                 example: Home check verified. Approved for adoption!
 *     responses:
 *       200:
 *         description: Application approved and Pet status updated to Adopted
 */
router.post('/:id/approve', optionalAuth, applicationController.approveApplication);

/**
 * @swagger
 * /api/applications/{id}/reject:
 *   post:
 *     summary: Reject adoption application (rejectApplication() - Sequence Diagram 2 Steps 7-8)
 *     tags: [Adoption Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewedBy:
 *                 type: integer
 *                 example: 1
 *               remarks:
 *                 type: string
 *                 example: Housing pet restriction policies not met.
 *     responses:
 *       200:
 *         description: Application rejected
 */
router.post('/:id/reject', optionalAuth, applicationController.rejectApplication);

module.exports = router;
