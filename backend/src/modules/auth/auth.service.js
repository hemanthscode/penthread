import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from './auth.model.js';
import config from '../../config/index.js';

/**
 * Generate short-lived access token
 */
function generateAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '15m' });
}

/**
 * Generate long-lived refresh token
 */
function generateRefreshToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
}

/**
 * Register a new user with unique email
 */
export async function registerUser(userInput) {
  const exists = await User.findOne({ email: userInput.email });
  if (exists) throw new Error('Email already registered');
  const user = new User(userInput);
  await user.save();
  return user;
}

/**
 * Authenticate user login credentials
 */
export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user || !user.isActive) throw new Error('Invalid email or password');
  const valid = await user.comparePassword(password);
  if (!valid) throw new Error('Invalid email or password');
  return user;
}

/**
 * Create access and refresh tokens
 */
export async function createTokens(user) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

/**
 * Verify provided refresh token validity
 */
export async function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Generate password reset token and persist hashed version
 */
export async function generatePasswordResetToken(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  return { user, resetToken };
}

/**
 * Reset password using valid token
 */
export async function resetPassword(token, newPassword) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error('Invalid or expired password reset token');

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return user;
}
