const User = require('../models/User');
const Adopter = require('../models/Adopter');
const ShelterWorker = require('../models/ShelterWorker');
const Volunteer = require('../models/Volunteer');
const { generateToken } = require('../middleware/auth');

/**
 * Register User (Adopter, ShelterWorker, or Volunteer)
 */
async function register(req, res, next) {
  try {
    const { name, email, password, phone, role = 'Adopter', ...extra } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    let newUser;
    switch (role) {
      case 'ShelterWorker':
        newUser = ShelterWorker.register({
          name, email, password, phone,
          employeeId: extra.employeeId,
          designation: extra.designation
        });
        break;
      case 'Volunteer':
        newUser = Volunteer.register({
          name, email, password, phone,
          volunteerId: extra.volunteerId,
          availability: extra.availability,
          serviceArea: extra.serviceArea
        });
        break;
      case 'Adopter':
      default:
        newUser = Adopter.register({
          name, email, password, phone,
          adoptionPreferences: extra.adoptionPreferences
        });
        break;
    }

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      user: newUser,
      token
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = User.login(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Login successful',
      user,
      token
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Logout
 */
async function logout(req, res) {
  const result = User.logout();
  res.json(result);
}

/**
 * Get current profile
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user ? req.user.userId : req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

/**
 * Update Profile
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user ? req.user.userId : req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const updatedUser = User.updateprofile(userId, req.body);

    if (req.body.adoptionPreferences && updatedUser.role === 'Adopter') {
      Adopter.updatePreferences(userId, req.body.adoptionPreferences);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: User.findById(userId)
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile
};
