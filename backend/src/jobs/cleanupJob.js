/**
 * Cleanup Job
 * 
 * Scheduled job to clean up old draft posts and activities.
 * 
 * @module jobs/cleanupJob
 */

import cron from 'node-cron';
import Post from '../modules/posts/post.model.js';
import { deleteOldActivities } from '../modules/activity/activity.service.js';
import { POST_STATUS } from '../utils/constants.js';
import logger from '../config/logger.js';

/**
 * Cleans up draft posts older than 30 days
 */
async function cleanupDraftPosts() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Post.deleteMany({
      status: POST_STATUS.DRAFT,
      createdAt: { $lt: thirtyDaysAgo },
    });

    logger.info(`Cleanup: Deleted ${result.deletedCount} old draft posts`);
  } catch (error) {
    logger.error('Failed to clean up draft posts:', error);
  }
}

/**
 * Cleans up activities older than 90 days
 */
async function cleanupOldActivities() {
  try {
    const result = await deleteOldActivities(90);
    logger.info(`Cleanup: Deleted ${result.count} old activities`);
  } catch (error) {
    logger.error('Failed to clean up old activities:', error);
  }
}

/**
 * Schedules cleanup jobs
 * - Draft posts: Daily at 2:00 AM
 * - Old activities: Weekly on Sunday at 3:00 AM
 */
export function scheduleCleanup() {
  // Clean draft posts daily at 2:00 AM
  cron.schedule(
    '0 2 * * *',
    async () => {
      logger.info('Running draft posts cleanup job...');
      await cleanupDraftPosts();
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );

  // Clean old activities weekly on Sunday at 3:00 AM
  cron.schedule(
    '0 3 * * 0',
    async () => {
      logger.info('Running old activities cleanup job...');
      await cleanupOldActivities();
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );

  logger.info('Cleanup jobs scheduled successfully');
}

export default { scheduleCleanup };
