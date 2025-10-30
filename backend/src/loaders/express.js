import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { corsOptions, apiRateLimiter } from '../config/appConfig.js';
import routes from './routes.js';
import logger from '../config/logger.js';

// Integrate Morgan HTTP logger with Winston
const morganStream = {
  write: (message) => logger.info(message.trim()),
};

export default function createExpressApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.use(apiRateLimiter);

  app.use(morgan('combined', { stream: morganStream }));

  // API routes under /api prefix
  app.use('/api', routes);

  // 404 handler for unknown API endpoints
  app.use((req, res, next) => {
    res.status(404).json({ message: 'API endpoint not found' });
  });

  // Global error handler middleware
  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  });

  return app;
}
