/**
 * Email Queue
 * 
 * Background job queue for sending emails asynchronously.
 * Uses Bull queue with Redis (optional).
 * 
 * @module jobs/emailQueue
 */

import Queue from 'bull';
import { sendEmail } from '../config/email.js';
import config from '../config/index.js';
import logger from '../config/logger.js';

let emailQueue = null;

/**
 * Initializes email queue if Redis is enabled
 */
function initEmailQueue() {
  if (!config.redis.enabled) {
    logger.info('Email queue disabled (Redis not enabled)');
    return null;
  }

  try {
    emailQueue = new Queue('email', {
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      },
    });

    // Process email jobs
    emailQueue.process(async (job) => {
      const { emailData } = job.data;
      
      try {
        await sendEmail(emailData);
        logger.info(`Email sent successfully to ${emailData.to_email}`);
      } catch (error) {
        logger.error(`Email sending failed for ${emailData.to_email}:`, error.message);
        throw error; // Let Bull handle retries
      }
    });

    // Event handlers
    emailQueue.on('completed', (job) => {
      logger.debug(`Email job ${job.id} completed`);
    });

    emailQueue.on('failed', (job, err) => {
      logger.error(`Email job ${job.id} failed:`, err.message);
    });

    logger.info('Email queue initialized successfully');
    
    return emailQueue;
  } catch (error) {
    logger.error('Failed to initialize email queue:', error);
    return null;
  }
}

/**
 * Adds an email to the queue
 */
export function queueEmail(emailData) {
  if (!emailQueue) {
    // Fallback: send email directly if queue is not available
    logger.warn('Email queue not available, sending email directly');
    return sendEmail(emailData);
  }

  return emailQueue.add(
    { emailData },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown() {
  if (emailQueue) {
    await emailQueue.close();
    logger.info('Email queue closed gracefully');
  }
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Initialize on load
emailQueue = initEmailQueue();

export default { queueEmail, emailQueue };
