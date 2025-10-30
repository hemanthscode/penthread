import { connectDB } from '../config/database.js';
import logger from '../config/logger.js';
import createExpressApp from './express.js';

export async function init() {
  try {
    await connectDB();
    logger.info('Database connection established.');
  } catch (error) {
    logger.error('Failed to connect to the database during app initialization.', error);
    process.exit(1);
  }

  const app = createExpressApp();

  // Initialize other loaders (cache, socket.io, etc.) here if needed

  return app;
}

export default logger;
