/**
 * Dashboard Controller
 * 
 * Handles HTTP requests for dashboard endpoints.
 * 
 * @module modules/dashboard/controller
 */

import * as dashboardService from './dashboard.service.js';
import { sendSuccess } from '../../utils/response.js';

/**
 * Get admin dashboard summary
 * GET /api/dashboard/admin/summary
 */
export async function adminSummary(req, res, next) {
  try {
    const data = await dashboardService.getAdminSummary();
    sendSuccess(res, data, 'Admin summary retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get admin dashboard statistics
 * GET /api/dashboard/admin/stats
 */
export async function adminStats(req, res, next) {
  try {
    const data = await dashboardService.getAdminStats();
    sendSuccess(res, data, 'Admin statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get author dashboard summary
 * GET /api/dashboard/author/summary
 */
export async function authorSummary(req, res, next) {
  try {
    const data = await dashboardService.getAuthorSummary(req.user._id);
    sendSuccess(res, data, 'Author summary retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get author dashboard statistics
 * GET /api/dashboard/author/stats
 */
export async function authorStats(req, res, next) {
  try {
    const data = await dashboardService.getAuthorStats(req.user._id);
    sendSuccess(res, data, 'Author statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get user dashboard summary
 * GET /api/dashboard/user/summary
 */
export async function userSummary(req, res, next) {
  try {
    const data = await dashboardService.getUserSummary(req.user._id);
    sendSuccess(res, data, 'User summary retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get user dashboard statistics
 * GET /api/dashboard/user/stats
 */
export async function userStats(req, res, next) {
  try {
    const data = await dashboardService.getUserStats(req.user._id);
    sendSuccess(res, data, 'User statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  adminSummary,
  adminStats,
  authorSummary,
  authorStats,
  userSummary,
  userStats,
};
