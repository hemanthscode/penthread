import { scheduleCleanup } from './cleanupJob.js';

/**
 * Initialize all background jobs and scheduled tasks here
 */
export function initJobs() {
  scheduleCleanup();
  // Add additional job initializations below as needed
}
