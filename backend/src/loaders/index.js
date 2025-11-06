/**
 * Application Initialization Loader
 * 
 * Initializes database connection and Express app.
 * 
 * @module loaders
 */

import { connectDB } from '../config/database.js';
import createExpressApp from './express.js';
import logger from '../config/logger.js';

/**
 * Initializes the application
 * @returns {Promise<Object>} Express app instance
 */
export async function init() {
  try {
    // Connect to database
    await connectDB();
    logger.info('✓ Database connected');

    // Create Express app
    const app = createExpressApp();
    logger.info('✓ Express app initialized');

    return app;
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

export default { init };
