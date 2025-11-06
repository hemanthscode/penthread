/**
 * Express Application Loader
 * 
 * Configures Express app with all middleware and error handling.
 * 
 * @module loaders/express
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptions, apiRateLimiter } from '../config/appConfig.js';
import routes from './routes.js';
import errorMiddleware from '../middlewares/error.middleware.js';
import requestLoggerMiddleware from '../middlewares/requestLogger.middleware.js';
import sanitizeMiddleware from '../middlewares/sanitize.middleware.js';
import logger from '../config/logger.js';
import config from '../config/index.js';

/**
 * Creates and configures Express application
 * @returns {Object} Configured Express app
 */
export default function createExpressApp() {
  const app = express();

  // Trust proxy (for rate limiting behind reverse proxy)
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false,
  }));

  // CORS
  app.use(cors(corsOptions));

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use(requestLoggerMiddleware);

  // Input sanitization
  app.use(sanitizeMiddleware);

  // Rate limiting
  app.use(apiRateLimiter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      environment: config.env,
    });
  });

  // API routes
  app.use('/api', routes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.path}`,
    });
  });

  // Global error handler
  app.use(errorMiddleware);

  logger.info('Express app configured successfully');

  return app;
}
