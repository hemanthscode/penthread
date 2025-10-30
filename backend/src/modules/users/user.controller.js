import * as userService from './user.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export async function getUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, users);
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.userId, req.body);
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.userId);
    return successResponse(res, null, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await userService.getUserById(req.user._id);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updatedUser = await userService.updateProfile(req.user._id, req.body);
    return successResponse(res, updatedUser);
  } catch (err) {
    next(err);
  }
}

export async function updateRole(req, res, next) {
  try {
    const updatedUser = await userService.updateUserRole(req.params.userId, req.body.role);
    return successResponse(res, updatedUser);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const updatedUser = await userService.updateUserStatus(req.params.userId, req.body.isActive);
    return successResponse(res, updatedUser);
  } catch (err) {
    next(err);
  }
}
