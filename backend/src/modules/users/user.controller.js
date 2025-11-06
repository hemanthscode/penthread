/**
 * User Controller
 * 
 * Handles HTTP requests for user management endpoints.
 * 
 * @module modules/users/controller
 */

import * as userService from './user.service.js';
import { sendSuccess, sendPaginatedResponse } from '../../utils/response.js';
import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';

/**
 * Get all users (admin only)
 * GET /api/users
 */
export async function getUsers(req, res, next) {
  try {
    const { page, limit } = getPaginationParams(req.query);
    const { role, isActive, search } = req.query;

    const options = { 
      page, 
      limit,
      role,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search,
    };

    const users = await userService.getAllUsers(options);
    
    // Build filter for count
    const filter = {};
    if (role) filter.role = role;
    if (typeof options.isActive === 'boolean') filter.isActive = options.isActive;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const totalItems = await userService.getUserCount(filter);
    const pagination = buildPaginationMeta(page, limit, totalItems);

    sendPaginatedResponse(res, users, pagination, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get user by ID (admin only)
 * GET /api/users/:userId
 */
export async function getUser(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.userId);
    sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update user (admin only)
 * PATCH /api/users/:userId
 */
export async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.userId, req.body);
    sendSuccess(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete user (admin only)
 * DELETE /api/users/:userId
 */
export async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.userId);
    sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get own profile
 * GET /api/users/profile/me
 */
export async function getProfile(req, res, next) {
  try {
    const user = await userService.getUserById(req.user._id);
    sendSuccess(res, user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update own profile
 * PATCH /api/users/profile/me
 */
export async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    sendSuccess(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update user role (admin only)
 * PATCH /api/users/:userId/role
 */
export async function updateRole(req, res, next) {
  try {
    const user = await userService.updateUserRole(
      req.params.userId,
      req.body.role,
      req.user._id
    );
    sendSuccess(res, user, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update user status (admin only)
 * PATCH /api/users/:userId/status
 */
export async function updateStatus(req, res, next) {
  try {
    const user = await userService.updateUserStatus(
      req.params.userId,
      req.body.isActive
    );
    sendSuccess(res, user, 'User status updated successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updateRole,
  updateStatus,
};
