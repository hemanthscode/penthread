import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';

/**
 * Sign JWT token
 * @param {Object} payload Payload to store in token
 * @param {string} expiresIn Token expiry (default: 15m)
 * @returns {string} JWT token
 */
export function signJwt(payload, expiresIn = '15m') {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

/**
 * Hash password with bcrypt
 * @param {string} password Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 * @param {string} password Plain password
 * @param {string} hashed Hashed password
 * @returns {Promise<boolean>} Password match result
 */
export async function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}
