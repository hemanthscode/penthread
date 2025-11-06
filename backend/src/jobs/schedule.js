/**
 * Job Scheduler
 * 
 * Initializes all background jobs and scheduled tasks.
 * 
 * @module jobs/schedule
 */

import { scheduleCleanup } from './cleanupJob.js';
import logger from '../config/logger.js';

/**
 * Initializes all scheduled jobs
 */
export function initJobs() {
  try {
    // Schedule cleanup jobs
    scheduleCleanup();

    logger.info('All background jobs initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize background jobs:', error);
  }
}

export default { initJobs };
