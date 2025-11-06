/**
 * Global Error Handling Middleware
 * 
 * Catches and processes all errors in the application.
 * Sends appropriate error responses based on environment.
 * 
 * @module middlewares/error
 */

import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';
import config from '../config/index.js';

/**
 * Handles Mongoose validation errors
 * @param {Error} err - Mongoose validation error
 * @returns {AppError} Formatted error
 */
function handleValidationError(err) {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return AppError.validationError(message);
}

/**
 * Handles Mongoose duplicate key errors
 * @param {Error} err - Mongoose duplicate key error
 * @returns {AppError} Formatted error
 */
function handleDuplicateKeyError(err) {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists`;
  return AppError.conflict(message);
}

/**
 * Handles Mongoose cast errors
 * @param {Error} err - Mongoose cast error
 * @returns {AppError} Formatted error
 */
function handleCastError(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return AppError.badRequest(message);
}

/**
 * Global error handler middleware
 */
export default function errorMiddleware(err, req, res, next) {
  let error = err;

  // Log error
  const reqLogger = req.logger || logger;
  reqLogger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Mongoose errors
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }
  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  // Default to 500 if not an operational error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  // Build error response
  const response = {
    success: false,
    message,
    ...(config.isDevelopment && {
      error: {
        statusCode,
        status: error.status,
        isOperational: error.isOperational,
        stack: err.stack,
      },
    }),
  };

  // Send error response
  res.status(statusCode).json(response);
}
