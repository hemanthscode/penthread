/**
 * Authentication Service
 * 
 * Handles all authentication business logic including registration,
 * login, token management, and password reset.
 * 
 * @module modules/auth/service
 */

import User from './auth.model.js';
import AppError from '../../utils/AppError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  generateResetToken,
  hashResetToken,
} from '../../utils/crypto.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../../config/email.js';
import { logActivity } from '../activity/activity.service.js';
import { createNotification } from '../notifications/notification.service.js';
import { ACTIVITY_TYPES } from '../../utils/constants.js';
import logger from '../../config/logger.js';

/**
 * Registers a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Created user
 */
export async function registerUser(userData) {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw AppError.conflict('Email already registered');
  }

  // Create user
  const user = new User({ name, email, password });
  await user.save();

  // Log activity
  try {
    await logActivity(user._id, ACTIVITY_TYPES.PROFILE_UPDATED, 'Account created');
  } catch (error) {
    logger.error('Failed to log registration activity:', error);
  }

  // Send welcome email (non-blocking)
  sendWelcomeEmail({ to_name: name, to_email: email }).catch((error) => {
    logger.error('Failed to send welcome email:', error);
  });

  logger.info(`New user registered: ${email}`);

  return user;
}

/**
 * Authenticates a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authenticated user
 */
export async function loginUser(email, password) {
  // Find user with password field
  const user = await User.findByEmail(email).select('+password +loginAttempts +lockUntil');

  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  // Check if account is locked
  if (user.isLocked()) {
    throw AppError.forbidden('Account is temporarily locked due to multiple failed login attempts');
  }

  // Check if account is active
  if (!user.isActive) {
    throw AppError.forbidden('Account is deactivated');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    await user.incrementLoginAttempts();
    throw AppError.unauthorized('Invalid email or password');
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Log activity
  try {
    await logActivity(user._id, ACTIVITY_TYPES.PROFILE_UPDATED, 'User logged in');
  } catch (error) {
    logger.error('Failed to log login activity:', error);
  }

  logger.info(`User logged in: ${email}`);

  // Remove sensitive fields before returning
  user.password = undefined;
  user.loginAttempts = undefined;
  user.lockUntil = undefined;

  return user;
}

/**
 * Creates access and refresh tokens for a user
 * @param {Object} user - User object
 * @returns {Object} Token pair
 */
export function createTokens(user) {
  const payload = {
    id: user._id,
    role: user.role,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

/**
 * Verifies a refresh token and returns payload
 * @param {string} token - Refresh token
 * @returns {Promise<Object>} Decoded payload
 */
export async function verifyRefreshToken(token) {
  try {
    const decoded = verifyToken(token);
    
    // Verify user still exists and is active
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw AppError.unauthorized('Invalid refresh token');
    }

    return decoded;
  } catch (error) {
    throw AppError.unauthorized('Invalid or expired refresh token');
  }
}

/**
 * Generates a password reset token
 * @param {string} email - User's email
 * @returns {Promise<Object>} User and reset token
 */
export async function generatePasswordResetToken(email) {
  const user = await User.findByEmail(email);

  if (!user) {
    throw AppError.notFound('No account found with that email');
  }

  if (!user.isActive) {
    throw AppError.forbidden('Account is deactivated');
  }

  // Generate reset token
  const resetToken = generateResetToken();
  const hashedToken = hashResetToken(resetToken);

  // Save hashed token to user
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // Send reset email (non-blocking)
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  sendPasswordResetEmail({
    to_name: user.name,
    to_email: user.email,
    reset_link: resetLink,
  }).catch((error) => {
    logger.error('Failed to send password reset email:', error);
  });

  logger.info(`Password reset requested for: ${email}`);

  return { user, resetToken };
}

/**
 * Resets user password using valid token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Updated user
 */
export async function resetPassword(token, newPassword) {
  const hashedToken = hashResetToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    throw AppError.badRequest('Invalid or expired password reset token');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Log activity
  try {
    await logActivity(user._id, ACTIVITY_TYPES.PASSWORD_CHANGED, 'Password reset via email');
  } catch (error) {
    logger.error('Failed to log password reset activity:', error);
  }

  logger.info(`Password reset successful for: ${user.email}`);

  return user;
}

/**
 * Changes user password (when logged in)
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Updated user
 */
export async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw AppError.notFound('User not found');
  }

  // Verify current password
  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) {
    throw AppError.unauthorized('Current password is incorrect');
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  // Log activity
  try {
    await logActivity(user._id, ACTIVITY_TYPES.PASSWORD_CHANGED, 'Password changed');
  } catch (error) {
    logger.error('Failed to log password change activity:', error);
  }

  logger.info(`Password changed for user: ${user.email}`);

  return user;
}

export default {
  registerUser,
  loginUser,
  createTokens,
  verifyRefreshToken,
  generatePasswordResetToken,
  resetPassword,
  changePassword,
};
