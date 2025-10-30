/**
 * Standard success response
 * @param {object} res Express response object
 * @param {object} data Payload data
 * @param {string} message Optional message
 * @returns {object} JSON response
 */
export function successResponse(res, data, message = '') {
  return res.json({ success: true, message, data });
}

/**
 * Standard error response
 * @param {object} res Express response object
 * @param {string} message Error message
 * @param {number} statusCode HTTP status code (default 500)
 * @returns {object} JSON response
 */
export function errorResponse(res, message = 'Error occurred', statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}
