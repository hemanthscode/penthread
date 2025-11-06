/**
 * Activity Service
 * 
 * Handles activity logging and retrieval.
 * 
 * @module modules/activity/service
 */

import Activity from './activity.model.js';
import logger from '../../config/logger.js';

/**
 * Logs a user activity
 */
export async function logActivity(userId, action, details = '', metadata = {}) {
  try {
    const activity = new Activity({
      user: userId,
      action,
      details,
      metadata,
    });

    await activity.save();

    logger.debug(`Activity logged: ${action} for user ${userId}`);

    return activity;
  } catch (error) {
    // Don't throw - activity logging shouldn't break main flow
    logger.error('Failed to log activity:', error);
    return null;
  }
}

/**
 * Gets user activities with pagination
 */
export async function getUserActivities(userId, options = {}) {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const activities = await Activity.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return activities;
}

/**
 * Gets recent activities for a user
 */
export async function getRecentActivities(userId, limit = 10) {
  return Activity.getUserTimeline(userId, limit);
}

/**
 * Deletes old activities (cleanup)
 */
export async function deleteOldActivities(daysOld = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await Activity.deleteMany({
    createdAt: { $lt: cutoffDate },
  });

  logger.info(`Deleted ${result.deletedCount} activities older than ${daysOld} days`);

  return { count: result.deletedCount };
}

export default {
  logActivity,
  getUserActivities,
  getRecentActivities,
  deleteOldActivities,
};
