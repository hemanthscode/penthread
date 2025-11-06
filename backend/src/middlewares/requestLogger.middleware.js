/**
 * Request Logger Middleware
 * 
 * Logs HTTP requests with duration tracking and request ID.
 * 
 * @module middlewares/requestLogger
 */

import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.js';

/**
 * Request logger middleware
 */
export default function requestLoggerMiddleware(req, res, next) {
  // Generate unique request ID
  const requestId = uuidv4();
  req.requestId = requestId;

  // Create request-scoped logger
  req.logger = logger.withRequestId(requestId);

  // Track request start time
  const startTime = Date.now();

  // Log request start
  req.logger.info(`→ ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Capture response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.httpLog(req, res, duration);
  });

  next();
}
