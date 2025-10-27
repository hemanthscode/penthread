import logger from '../config/logger.js';

// Global error handler middleware
export default function errorMiddleware(err, req, res, next) {
  logger.error(err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
