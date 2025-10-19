import { connectDB } from '../config/database.js';
import logger from '../config/logger.js';
import createExpressApp from './express.js';

export async function init() {
  await connectDB();

  const app = createExpressApp();

  // Here you can initialize other loaders if needed (e.g., cache, sockets)

  return app;
}

export default logger;
