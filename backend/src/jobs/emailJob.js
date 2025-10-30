import Queue from 'bull';
import { sendEmail } from '../config/email.js';
import logger from '../config/logger.js';

const REDIS_CONFIG = { host: '127.0.0.1', port: 6379 }; // Customize as per your environment

const emailQueue = new Queue('email', { redis: REDIS_CONFIG });

// Process email jobs with error handling and logging
emailQueue.process(async (job) => {
  const { templateParams } = job.data;
  try {
    await sendEmail(templateParams);
    logger.info(`Email sent successfully to ${templateParams.to_email}`);
  } catch (error) {
    logger.error(`Email sending failed for ${templateParams.to_email}: ${error.message}`);
    throw error; // Let Bull handle retries/failure policies
  }
});

// Graceful shutdown handler to close queue connections if needed
async function gracefulShutdown() {
  await emailQueue.close();
  logger.info('Email queue shut down gracefully');
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

/**
 * Enqueue an email send job
 * @param {object} templateParams Parameters for the email template
 */
export function queueEmail(templateParams) {
  return emailQueue.add({ templateParams }, {
    attempts: 3,            // Retry thrice upon failure
    backoff: 5000,          // 5 seconds delay between retries
    removeOnComplete: true, // Auto remove completed jobs
  });
}

export default emailQueue;
