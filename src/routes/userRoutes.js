const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users with role-specific profile data
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users/volunteers:
 *   get:
 *     summary: List all registered volunteers (with volunteerId, availability, serviceArea)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of volunteers
 */
router.get('/volunteers', userController.getVolunteers);

/**
 * @swagger
 * /api/users/shelter-workers:
 *   get:
 *     summary: List all shelter workers (with employeeId, designation)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of shelter workers
 */
router.get('/shelter-workers', userController.getShelterWorkers);

/**
 * @swagger
 * /api/users/adopters:
 *   get:
 *     summary: List all adopters (with adoptionPreferences)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of adopters
 */
router.get('/adopters', userController.getAdopters);

module.exports = router;
