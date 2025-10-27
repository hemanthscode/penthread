// Express app loader with essential middlewares and routes
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { corsOptions, apiRateLimiter } from '../config/appConfig.js';
import routes from './routes.js';
import logger from '../config/logger.js';

// Morgan stream for Winston integration
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

  // HTTP request logger
  app.use(morgan('combined', { stream: morganStream }));

  // Attach all API routes
  app.use('/api', routes);

  // 404 for unknown routes
  app.use((req, res, next) => {
    res.status(404).json({ message: 'API endpoint not found' });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  });

  return app;
}
