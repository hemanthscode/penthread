// Initializes loaders: connect database & create express app
import { connectDB } from '../config/database.js';
import logger from '../config/logger.js';
import createExpressApp from './express.js';

export async function init() {
  await connectDB();
  const app = createExpressApp();
  // Additional loaders (e.g. cache, socket) can be initialized here
  return app;
}

export default logger;
