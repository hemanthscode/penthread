import { scheduleCleanup } from './cleanupJob.js';

// Initialize scheduled jobs here
export function initJobs() {
  scheduleCleanup();
  // Additional scheduled jobs can be added here
}
