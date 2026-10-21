const express = require('express');
const router = express.Router();
const rescueAlertController = require('../controllers/rescueAlertController');
const { optionalAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/rescue-alerts:
 *   post:
 *     summary: Report emergency animal rescue (createRescueAlerts() - Sequence Diagram 3 Steps 1-2)
 *     tags: [Rescue Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - latitude
 *               - longitude
 *             properties:
 *               description:
 *                 type: string
 *                 example: Injured stray dog with deep paw laceration near SPIT sports ground
 *               photoURL:
 *                 type: string
 *                 example: https://images.unsplash.com/photo-1548199973-03cce0bbc87b
 *               latitude:
 *                 type: number
 *                 example: 19.1234
 *               longitude:
 *                 type: number
 *                 example: 72.8361
 *               severity:
 *                 type: string
 *                 enum: [Low, Medium, High, Critical]
 *                 example: High
 *               reportedBy:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Rescue alert created
 *   get:
 *     summary: List all rescue alerts (filterable by status, severity, volunteerId)
 *     tags: [Rescue Alerts]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Reported, Assigned, In Progress, Completed, Closed]
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 *       - in: query
 *         name: volunteerId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of rescue alerts
 */
router.post('/', optionalAuth, rescueAlertController.createRescueAlert);
router.get('/', rescueAlertController.listAlerts);

/**
 * @swagger
 * /api/rescue-alerts/{id}:
 *   get:
 *     summary: Get rescue alert details
 *     tags: [Rescue Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alert details
 *       404:
 *         description: Alert not found
 *   put:
 *     summary: Update rescue alert details (updateRescueAlerts() - Sequence Diagram 3 Steps 5-6)
 *     tags: [Rescue Alerts]
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
 *               status:
 *                 type: string
 *                 enum: [Reported, Assigned, In Progress, Completed, Closed]
 *                 example: In Progress
 *               description:
 *                 type: string
 *               severity:
 *                 type: string
 *                 enum: [Low, Medium, High, Critical]
 *     responses:
 *       200:
 *         description: Alert updated successfully
 */
router.get('/:id', rescueAlertController.getAlertDetails);
router.put('/:id', optionalAuth, rescueAlertController.updateRescueAlert);

/**
 * @swagger
 * /api/rescue-alerts/{id}/assign:
 *   post:
 *     summary: Assign volunteer to rescue alert (assignVolunteer() - Sequence Diagram 3 Steps 3-4)
 *     tags: [Rescue Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Alert ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - volunteerId
 *             properties:
 *               volunteerId:
 *                 type: integer
 *                 description: User ID of Volunteer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Volunteer assigned successfully
 */
router.post('/:id/assign', optionalAuth, rescueAlertController.assignVolunteer);

/**
 * @swagger
 * /api/rescue-alerts/{id}/complete:
 *   post:
 *     summary: Complete rescue operation (completeRescue() & closeAlert() - Sequence Diagram 3 Steps 7-9)
 *     description: Marks rescue completed and automatically self-closes the alert
 *     tags: [Rescue Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Alert ID
 *     responses:
 *       200:
 *         description: Rescue completed and alert closed
 */
router.post('/:id/complete', optionalAuth, rescueAlertController.completeRescue);

/**
 * @swagger
 * /api/rescue-alerts/{id}/close:
 *   post:
 *     summary: Close rescue alert directly (closeAlert() - Sequence Diagram 3 Step 8)
 *     tags: [Rescue Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alert closed
 */
router.post('/:id/close', optionalAuth, rescueAlertController.closeAlert);

module.exports = router;
