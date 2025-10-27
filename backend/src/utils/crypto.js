import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';

// Generate JWT token with configurable expiration
export function signJwt(payload, expiresIn = '15m') {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

// Hash a password securely with bcrypt
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare plain password with hashed password
export async function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}
