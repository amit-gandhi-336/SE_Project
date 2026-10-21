const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { optionalAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: List all pets with filters
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filter by species (e.g. Dog, Cat)
 *       - in: query
 *         name: adoptionStatus
 *         schema:
 *           type: string
 *           enum: [Available, Pending, Adopted]
 *         description: Filter by adoption status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword across name, breed, location
 *     responses:
 *       200:
 *         description: Array of pets
 *   post:
 *     summary: Add a new pet to the shelter (ShelterWorker.addpet() in UML)
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - breed
 *             properties:
 *               name:
 *                 type: string
 *                 example: Max
 *               species:
 *                 type: string
 *                 example: Dog
 *               breed:
 *                 type: string
 *                 example: Labrador Retriever
 *               age:
 *                 type: integer
 *                 example: 3
 *               gender:
 *                 type: string
 *                 example: Male
 *               size:
 *                 type: string
 *                 example: Large
 *               location:
 *                 type: string
 *                 example: Bhavan Shelter, Andheri West
 *               medicalNeeds:
 *                 type: string
 *                 example: None, healthy
 *               vaccinationStatus:
 *                 type: string
 *                 example: Fully Vaccinated
 *               adoptionStatus:
 *                 type: string
 *                 example: Available
 *               description:
 *                 type: string
 *                 example: Very playful and friendly with children
 *               photoURL:
 *                 type: string
 *                 example: https://images.unsplash.com/photo-1552053831-71594a27632d
 *               addedBy:
 *                 type: integer
 *                 description: ShelterWorker userId
 *                 example: 1
 *     responses:
 *       201:
 *         description: Pet created successfully
 */
router.get('/', petController.listPets);
router.post('/', optionalAuth, petController.addPet);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: View pet details (Pet.viewDetails() - Sequence Diagram 1 Steps 1-2)
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet details retrieved
 *       404:
 *         description: Pet not found
 *   put:
 *     summary: Update pet details (Pet.updatePetDetails())
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               age: { type: integer }
 *               location: { type: string }
 *               medicalNeeds: { type: string }
 *               vaccinationStatus: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Pet updated successfully
 */
router.get('/:id', petController.viewDetails);
router.put('/:id', optionalAuth, petController.updatePetDetails);

/**
 * @swagger
 * /api/pets/{id}/status:
 *   patch:
 *     summary: Update pet adoption status (Pet.updateStatus() - Sequence Diagram 2 Step 5)
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Available, Pending, Adopted]
 *                 example: Adopted
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', optionalAuth, petController.updateStatus);

/**
 * @swagger
 * /api/pets/{id}/sponsor:
 *   post:
 *     summary: Sponsor a pet (Pet.sponserPet() in UML)
 *     tags: [Pets]
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
 *               amount:
 *                 type: number
 *                 example: 500
 *               sponsorName:
 *                 type: string
 *                 example: Priya
 *     responses:
 *       200:
 *         description: Pet sponsored successfully
 */
router.post('/:id/sponsor', petController.sponsorPet);

module.exports = router;
