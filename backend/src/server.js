import http from 'http';
import app from './app.js';
import { init } from './loaders/index.js';
import config from './config/index.js';
import logger from './config/logger.js';

(async () => {
  try {
    const expressApp = await init();

    const server = http.createServer(expressApp);

    server.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });

    // Handle shutdown signals
    const gracefulShutdown = () => {
      logger.info('Shutting down...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
})();
