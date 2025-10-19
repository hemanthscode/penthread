import expressApp from './loaders/express.js';
import { initJobs } from './jobs/schedule.js';
import logger from './config/logger.js';

const app = expressApp();

// Initialize scheduled jobs
initJobs();

export default app;
