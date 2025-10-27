import Queue from 'bull';
import { sendEmail } from '../config/email.js';
import logger from '../config/logger.js';

// Redis connection configuration for Bull queue
const emailQueue = new Queue('email', {
  redis: { host: '127.0.0.1', port: 6379 }, // Adjust Redis config as needed
});

// Process email sending jobs asynchronously
emailQueue.process(async (job) => {
  try {
    const { templateParams } = job.data;
    await sendEmail(templateParams);
    logger.info(`Email sent successfully to ${templateParams.to_email}`);
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);
    throw error;
  }
});

// Function to enqueue email jobs
export function queueEmail(templateParams) {
  return emailQueue.add({ templateParams });
}

export default emailQueue;
