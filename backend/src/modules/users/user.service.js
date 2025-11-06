/**
 * User Service
 * 
 * Handles user management business logic.
 * 
 * @module modules/users/service
 */

import User from '../auth/auth.model.js';
import AppError from '../../utils/AppError.js';
import { ROLES } from '../../utils/constants.js';
import { logActivity } from '../activity/activity.service.js';
import { createNotification } from '../notifications/notification.service.js';
import { ACTIVITY_TYPES, NOTIFICATION_TYPES } from '../../utils/constants.js';
import logger from '../../config/logger.js';

/**
 * Gets all users with pagination
 * @param {Object} options - Query options
 * @returns {Promise<Array>} List of users
 */
export async function getAllUsers(options = {}) {
  const { page = 1, limit = 10, role, isActive, search } = options;
  const skip = (page - 1) * limit;

  const filter = {};
  
  if (role) filter.role = role;
  if (typeof isActive === 'boolean') filter.isActive = isActive;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return users;
}

/**
 * Gets total user count
 * @param {Object} filter - Query filter
 * @returns {Promise<number>} User count
 */
export async function getUserCount(filter = {}) {
  return User.countDocuments(filter);
}

/**
 * Gets a user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User document
 */
export async function getUserById(userId) {
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    throw AppError.notFound('User not found');
  }

  return user;
}

/**
 * Updates a user (admin operation)
 * @param {string} userId - User ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated user
 */
export async function updateUser(userId, updateData) {
  const allowedFields = ['name', 'email', 'bio', 'avatar'];
  const updates = {};

  // Filter allowed fields
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw AppError.badRequest('No valid fields to update');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw AppError.notFound('User not found');
  }

  logger.info(`User updated: ${user.email}`);

  return user;
}

/**
 * Updates own profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data
 * @returns {Promise<Object>} Updated user
 */
export async function updateProfile(userId, profileData) {
  const allowedFields = ['name', 'bio', 'avatar'];
  const updates = {};

  // Filter allowed fields
  allowedFields.forEach(field => {
    if (profileData[field] !== undefined) {
      updates[field] = profileData[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw AppError.badRequest('No valid fields to update');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw AppError.notFound('User not found');
  }

  // Log activity
  try {
    await logActivity(userId, ACTIVITY_TYPES.PROFILE_UPDATED, 'Profile updated');
  } catch (error) {
    logger.error('Failed to log profile update activity:', error);
  }

  logger.info(`User profile updated: ${user.email}`);

  return user;
}

/**
 * Updates user role (admin only)
 * @param {string} userId - User ID
 * @param {string} newRole - New role
 * @param {string} adminId - Admin user ID
 * @returns {Promise<Object>} Updated user
 */
export async function updateUserRole(userId, newRole, adminId) {
  if (!Object.values(ROLES).includes(newRole)) {
    throw AppError.badRequest('Invalid role specified');
  }

  const user = await User.findById(userId);
  
  if (!user) {
    throw AppError.notFound('User not found');
  }

  const oldRole = user.role;
  user.role = newRole;
  await user.save();

  // Create notification
  try {
    await createNotification({
      user: userId,
      title: 'Role Updated',
      message: `Your role has been changed from ${oldRole} to ${newRole}`,
      link: '/profile',
    });
  } catch (error) {
    logger.error('Failed to create role change notification:', error);
  }

  logger.info(`User role updated: ${user.email} (${oldRole} → ${newRole})`);

  return user;
}

/**
 * Updates user status (admin only)
 * @param {string} userId - User ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<Object>} Updated user
 */
export async function updateUserStatus(userId, isActive) {
  const user = await User.findById(userId);
  
  if (!user) {
    throw AppError.notFound('User not found');
  }

  user.isActive = isActive;
  await user.save();

  logger.info(`User status updated: ${user.email} (active: ${isActive})`);

  return user;
}

/**
 * Deletes a user (admin only)
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function deleteUser(userId) {
  const user = await User.findById(userId);
  
  if (!user) {
    throw AppError.notFound('User not found');
  }

  // Prevent deleting the last admin
  if (user.role === ROLES.ADMIN) {
    const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
    if (adminCount <= 1) {
      throw AppError.badRequest('Cannot delete the last admin user');
    }
  }

  await user.deleteOne();

  logger.info(`User deleted: ${user.email}`);
}

export default {
  getAllUsers,
  getUserCount,
  getUserById,
  updateUser,
  updateProfile,
  updateUserRole,
  updateUserStatus,
  deleteUser,
};
