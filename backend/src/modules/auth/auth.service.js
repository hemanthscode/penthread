// Auth service: core user management, JWT tokens, password resets, and verification
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from './auth.model.js';
import config from '../../config/index.js';

function generateAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
}

export async function registerUser(userInput) {
  if (await User.findOne({ email: userInput.email })) throw new Error('Email already in use');
  const user = new User(userInput);
  await user.save();
  return user;
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user || !user.isActive) throw new Error('Invalid email or password');
  const isValid = await user.comparePassword(password);
  if (!isValid) throw new Error('Invalid email or password');
  return user;
}

export async function createTokens(user) {
  return { accessToken: generateAccessToken(user), refreshToken: generateRefreshToken(user) };
}

export async function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    throw new Error('Invalid refresh token');
  }
}

export async function generatePasswordResetToken(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  return { user, resetToken };
}

export async function resetPassword(token, newPassword) {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) throw new Error('Invalid or expired token');

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return user;
}
