import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';

export function signJwt(payload, expiresIn = '15m') {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}
