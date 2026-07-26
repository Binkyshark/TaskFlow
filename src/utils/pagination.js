/**
 * Parse pagination query parameters
 * @param {Object} query - Express req.query
 * @returns {Object} { page, limit, skip }
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Generate pagination meta details
 * @param {Number} total - total document count
 * @param {Number} page 
 * @param {Number} limit 
 */
const getPagingData = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    totalItems: total,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

module.exports = {
  getPagination,
  getPagingData
};
