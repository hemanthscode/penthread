/**
 * Cryptography Utilities
 * 
 * Handles password hashing, JWT signing, and token generation.
 * 
 * @module utils/crypto
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import config from '../config/index.js';

/**
 * Hashes a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, config.security.bcryptRounds);
}

/**
 * Compares password with hash
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} Comparison result
 */
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Signs a JWT access token
 * @param {Object} payload - Token payload
 * @returns {string} Signed JWT token
 */
export function signAccessToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiry,
  });
}

/**
 * Signs a JWT refresh token
 * @param {Object} payload - Token payload
 * @returns {string} Signed JWT token
 */
export function signRefreshToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiry,
  });
}

/**
 * Verifies a JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Generates a random token for password reset
 * @returns {string} Random hex token
 */
export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hashes a reset token for storage
 * @param {string} token - Plain text token
 * @returns {string} Hashed token
 */
export function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export default {
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyToken,
  generateResetToken,
  hashResetToken,
};
