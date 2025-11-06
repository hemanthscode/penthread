/**
 * Pagination Utilities
 * 
 * Handles pagination logic for API responses.
 * 
 * @module utils/pagination
 */

import config from '../config/index.js';

/**
 * Parses and validates pagination parameters
 * @param {Object} query - Request query parameters
 * @param {number} query.page - Page number
 * @param {number} query.limit - Items per page
 * @returns {Object} Validated pagination params
 */
export function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    config.pagination.maxLimit,
    Math.max(1, parseInt(query.limit, 10) || config.pagination.defaultLimit)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Builds pagination metadata for API response
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total items count
 * @returns {Object} Pagination metadata
 */
export function buildPaginationMeta(page, limit, totalItems) {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
}

export default {
  getPaginationParams,
  buildPaginationMeta,
};
