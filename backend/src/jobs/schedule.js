import { scheduleCleanup } from './cleanupJob.js';

export function initJobs() {
  scheduleCleanup();
  // Add other jobs scheduling here as needed
}
