import cron from 'node-cron';
import Post from '../modules/posts/post.model.js';
import logger from '../config/logger.js';

/**
 * Schedule a cron job to delete draft posts older than 30 days at 2:00 AM daily
 */
export function scheduleCleanup() {
  cron.schedule('0 2 * * *', async () => {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() - 30);
      const result = await Post.deleteMany({ status: 'draft', createdAt: { $lt: expiryDate } });
      logger.info(`Cleanup job: Deleted ${result.deletedCount} old draft posts`);
    } catch (error) {
      logger.error(`Cleanup job failed: ${error.message}`);
    }
  }, {
    timezone: 'Asia/Kolkata' // Set timezone explicitly if needed
  });
}
