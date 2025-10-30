import logger from '../config/logger.js';

export default function errorMiddleware(err, req, res, next) {
  logger.error(err);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
