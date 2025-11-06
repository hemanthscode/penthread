/**
 * Response Utilities
 * 
 * Standardized API response formats.
 * 
 * @module utils/response
 */

/**
 * Sends success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} JSON response
 */
export function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Sends error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} errors - Validation errors (optional)
 * @returns {Object} JSON response
 */
export function sendError(res, message = 'Error occurred', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

/**
 * Sends paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination metadata
 * @param {string} message - Success message
 * @returns {Object} JSON response
 */
export function sendPaginatedResponse(res, data, pagination, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
}

// Legacy aliases for backward compatibility
export const successResponse = sendSuccess;
export const errorResponse = sendError;

export default {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
  successResponse,
  errorResponse,
};
