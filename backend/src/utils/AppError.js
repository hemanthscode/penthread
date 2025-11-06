/**
 * Custom Application Error Class
 * 
 * Provides consistent error handling across the application.
 * Supports HTTP status codes and operational error flags.
 * 
 * @module utils/AppError
 */

/**
 * Application Error Class
 * @extends Error
 */
class AppError extends Error {
  /**
   * Creates an AppError instance
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} isOperational - Whether error is operational (true) or programming (false)
   */
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Creates a bad request error (400)
   */
  static badRequest(message = 'Bad Request') {
    return new AppError(message, 400);
  }

  /**
   * Creates an unauthorized error (401)
   */
  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  /**
   * Creates a forbidden error (403)
   */
  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403);
  }

  /**
   * Creates a not found error (404)
   */
  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  /**
   * Creates a conflict error (409)
   */
  static conflict(message = 'Conflict') {
    return new AppError(message, 409);
  }

  /**
   * Creates a validation error (422)
   */
  static validationError(message = 'Validation failed') {
    return new AppError(message, 422);
  }

  /**
   * Creates an internal server error (500)
   */
  static internal(message = 'Internal server error') {
    return new AppError(message, 500);
  }
}

export default AppError;
