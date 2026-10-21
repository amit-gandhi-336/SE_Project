const { getDb } = require('../config/db');

function getVolunteers(req, res, next) {
  try {
    const db = getDb();
    const volunteers = db.prepare(`
      SELECT u.userId, u.name, u.email, u.phone, u.role,
             v.volunteerId, v.availability, v.serviceArea
      FROM users u
      JOIN volunteers v ON u.userId = v.userId
    `).all();
    res.json({ success: true, count: volunteers.length, volunteers });
  } catch (err) {
    next(err);
  }
}

function getShelterWorkers(req, res, next) {
  try {
    const db = getDb();
    const workers = db.prepare(`
      SELECT u.userId, u.name, u.email, u.phone, u.role,
             s.employeeId, s.designation
      FROM users u
      JOIN shelter_workers s ON u.userId = s.userId
    `).all();
    res.json({ success: true, count: workers.length, workers });
  } catch (err) {
    next(err);
  }
}

function getAdopters(req, res, next) {
  try {
    const db = getDb();
    const adopters = db.prepare(`
      SELECT u.userId, u.name, u.email, u.phone, u.role,
             a.adoptionPreferences
      FROM users u
      JOIN adopters a ON u.userId = a.userId
    `).all();
    res.json({ success: true, count: adopters.length, adopters });
  } catch (err) {
    next(err);
  }
}

function getAllUsers(req, res, next) {
  try {
    const db = getDb();
    const users = db.prepare(`
      SELECT u.userId, u.name, u.email, u.phone, u.role, u.createdAt,
             a.adoptionPreferences,
             s.employeeId, s.designation,
             v.volunteerId, v.availability, v.serviceArea
      FROM users u
      LEFT JOIN adopters a ON u.userId = a.userId
      LEFT JOIN shelter_workers s ON u.userId = s.userId
      LEFT JOIN volunteers v ON u.userId = v.userId
      ORDER BY u.userId ASC
    `).all();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getVolunteers,
  getShelterWorkers,
  getAdopters,
  getAllUsers
};
