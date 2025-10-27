// Utilities for pagination parameters parsing and validation
export function getPagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, parseInt(query.limit, 10) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
