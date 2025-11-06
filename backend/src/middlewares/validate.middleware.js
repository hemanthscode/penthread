/**
 * Validation Middleware
 * 
 * Validates request data using Joi schemas.
 * 
 * @module middlewares/validate
 */

import AppError from '../utils/AppError.js';

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Property to validate (body, query, params)
 * @returns {Function} Express middleware
 */
export default function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      const message = errors.map(e => e.message).join(', ');
      
      return next(AppError.validationError(message));
    }

    // Replace with validated and sanitized value
    req[property] = value;
    next();
  };
}
