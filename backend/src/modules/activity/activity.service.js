import Activity from './activity.model.js';

/**
 * Log a user activity
 */
export async function logActivity(userId, action, details = '') {
  const activity = new Activity({ user: userId, action, details });
  await activity.save();
  return activity;
}

/**
 * Retrieve user activities limited to recent 20 by default
 */
export async function getUserActivities(userId, limit = 20) {
  return Activity.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
}
