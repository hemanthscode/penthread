/**
 * Authentication Controller
 * 
 * Handles HTTP requests for authentication endpoints.
 * 
 * @module modules/auth/controller
 */

import * as authService from './auth.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import AppError from '../../utils/AppError.js';

/**
 * Register new user
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    
    sendSuccess(res, 
      { 
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const user = await authService.loginUser(req.body.email, req.body.password);
    const tokens = authService.createTokens(user);

    sendSuccess(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
export async function logout(req, res, next) {
  try {
    // For JWT, logout is handled client-side by discarding tokens
    // Could implement token blacklisting here if needed
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw AppError.badRequest('Refresh token is required');
    }

    const payload = await authService.verifyRefreshToken(refreshToken);
    const user = { _id: payload.id, role: payload.role };
    const tokens = authService.createTokens(user);

    sendSuccess(res, { tokens }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export async function forgotPassword(req, res, next) {
  try {
    const { user, resetToken } = await authService.generatePasswordResetToken(req.body.email);

    // In development, return token for testing
    const data = process.env.NODE_ENV === 'development' 
      ? { resetToken, message: 'Development mode: Token returned in response' }
      : null;

    sendSuccess(
      res,
      data,
      'Password reset email sent. Please check your inbox.'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Reset password using token
 * POST /api/auth/reset-password
 */
export async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    sendSuccess(res, null, 'Password reset successful. You can now login with your new password.');
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user profile
 * GET /api/auth/me
 */
export async function getProfile(req, res, next) {
  try {
    const { _id, name, email, role, avatar, bio, createdAt, lastLoginAt } = req.user;
    
    sendSuccess(res, {
      id: _id,
      name,
      email,
      role,
      avatar,
      bio,
      createdAt,
      lastLoginAt,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Change password (authenticated)
 * PATCH /api/auth/change-password
 */
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    
    sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  changePassword,
};
