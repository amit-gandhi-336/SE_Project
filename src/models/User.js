const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');

/**
 * Base User Model
 * Attributes: userId, name, email, password, phone, role
 * Methods: register(), login(), logout(), updateprofile()
 */
class User {
  constructor(data = {}) {
    this.userId = data.userId || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.phone = data.phone || '';
    this.role = data.role || 'Adopter';
  }

  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, phone, role, ...extraFields }
   * @returns {User}
   */
  static register(userData) {
    const db = getDb();
    const existing = db.prepare('SELECT userId FROM users WHERE email = ?').get(userData.email);
    if (existing) {
      throw new Error(`User with email "${userData.email}" already exists`);
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(userData.password, saltRounds);

    const insert = db.prepare(`
      INSERT INTO users (name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `);

    const res = insert.run(
      userData.name,
      userData.email,
      hashedPassword,
      userData.phone || '',
      userData.role || 'Adopter'
    );

    const userId = Number(res.lastInsertRowid);
    return this.findById(userId);
  }

  /**
   * Login user with email and password
   * @param {string} email
   * @param {string} password
   * @returns {User|null}
   */
  static login(email, password) {
    const db = getDb();
    const row = db.prepare(`
      SELECT u.*, 
             a.adoptionPreferences,
             s.employeeId, s.designation,
             v.volunteerId, v.availability, v.serviceArea
      FROM users u
      LEFT JOIN adopters a ON u.userId = a.userId
      LEFT JOIN shelter_workers s ON u.userId = s.userId
      LEFT JOIN volunteers v ON u.userId = v.userId
      WHERE u.email = ?
    `).get(email);

    if (!row) return null;

    const isMatch = bcrypt.compareSync(password, row.password);
    if (!isMatch) return null;

    // Return safe user object (omit password)
    const { password: pwd, ...safeUser } = row;
    return safeUser;
  }

  /**
   * Find user by ID including role-specific sub-table data
   * @param {number} userId
   * @returns {Object|null}
   */
  static findById(userId) {
    const db = getDb();
    const row = db.prepare(`
      SELECT u.userId, u.name, u.email, u.phone, u.role, u.createdAt,
             a.adoptionPreferences,
             s.employeeId, s.designation,
             v.volunteerId, v.availability, v.serviceArea
      FROM users u
      LEFT JOIN adopters a ON u.userId = a.userId
      LEFT JOIN shelter_workers s ON u.userId = s.userId
      LEFT JOIN volunteers v ON u.userId = v.userId
      WHERE u.userId = ?
    `).get(userId);

    return row || null;
  }

  /**
   * Update profile details
   * @param {number} userId
   * @param {Object} updateData - { name, phone, email, ... }
   * @returns {Object}
   */
  static updateprofile(userId, updateData) {
    const db = getDb();
    const user = this.findById(userId);
    if (!user) throw new Error('User not found');

    const name = updateData.name !== undefined ? updateData.name : user.name;
    const phone = updateData.phone !== undefined ? updateData.phone : user.phone;
    const email = updateData.email !== undefined ? updateData.email : user.email;

    db.prepare(`
      UPDATE users SET name = ?, phone = ?, email = ? WHERE userId = ?
    `).run(name, phone, email, userId);

    return this.findById(userId);
  }

  /**
   * Invalidate session / placeholder for token-based logout
   */
  static logout() {
    return { success: true, message: 'Successfully logged out' };
  }
}

module.exports = User;
