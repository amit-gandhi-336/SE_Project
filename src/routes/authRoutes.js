const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { optionalAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new User (Adopter, ShelterWorker, or Volunteer)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Priya Sharma
 *               email:
 *                 type: string
 *                 example: priya.new@gmail.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               phone:
 *                 type: string
 *                 example: "+91-9822012345"
 *               role:
 *                 type: string
 *                 enum: [Adopter, ShelterWorker, Volunteer]
 *                 example: Adopter
 *               adoptionPreferences:
 *                 type: string
 *                 description: Required if role is Adopter
 *                 example: Friendly medium dogs
 *               employeeId:
 *                 type: integer
 *                 description: Required if role is ShelterWorker
 *                 example: 105
 *               designation:
 *                 type: string
 *                 description: For ShelterWorker
 *                 example: Senior Care Officer
 *               volunteerId:
 *                 type: integer
 *                 description: Required if role is Volunteer
 *                 example: 505
 *               availability:
 *                 type: string
 *                 description: For Volunteer
 *                 example: Weekends & Evenings
 *               serviceArea:
 *                 type: string
 *                 description: For Volunteer
 *                 example: Andheri West, Mumbai
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or duplicate email
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and obtain JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: amit@spit.ac.in
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful with JWT token and user info
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout confirmation
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: User ID (if not passing Bearer token)
 *     responses:
 *       200:
 *         description: User profile retrieved
 *   put:
 *     summary: Update profile details (User.updateprofile() in UML)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Amit Gandhi
 *               phone:
 *                 type: string
 *                 example: "+91-9876543210"
 *               email:
 *                 type: string
 *                 example: amit@spit.ac.in
 *               adoptionPreferences:
 *                 type: string
 *                 example: Looking for friendly rescue pups
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.get('/profile', optionalAuth, authController.getProfile);
router.put('/profile', optionalAuth, authController.updateProfile);

module.exports = router;
