/**
 * Activity Controller
 * 
 * Handles HTTP requests for activity endpoints.
 * 
 * @module modules/activity/controller
 */

import * as activityService from './activity.service.js';
import { sendSuccess, sendPaginatedResponse } from '../../utils/response.js';
import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';

/**
 * Get user activities
 * GET /api/activity
 */
export async function getActivities(req, res, next) {
  try {
    const { page, limit } = getPaginationParams(req.query);

    const activities = await activityService.getUserActivities(req.user._id, {
      page,
      limit,
    });

    // Get total count
    const Activity = (await import('./activity.model.js')).default;
    const total = await Activity.countDocuments({ user: req.user._id });
    const pagination = buildPaginationMeta(page, limit, total);

    sendPaginatedResponse(
      res,
      activities,
      pagination,
      'Activities retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get recent activities
 * GET /api/activity/recent
 */
export async function getRecentActivities(req, res, next) {
  try {
    const { limit = 10 } = req.query;
    const activities = await activityService.getRecentActivities(
      req.user._id,
      parseInt(limit)
    );

    sendSuccess(res, activities, 'Recent activities retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  getActivities,
  getRecentActivities,
};
