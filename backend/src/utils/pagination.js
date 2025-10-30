/**
 * Parse query parameters to pagination params with safe defaults and limits
 * @param {object} query Request query params
 * @returns {{page: number, limit: number, skip: number}} Pagination params
 */
export function getPagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, parseInt(query.limit, 10) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
