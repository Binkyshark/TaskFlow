const { ACTIVITY_ACTIONS, ENTITY_TYPES } = require('./activity.model');

/**
 * Validate activity query parameters
 * @param {Object} data - req.body or req.query
 * @param {Object} queryParams - req.query (when called from validation middleware)
 * @returns {Object} { error } or { value: { query } }
 */
const validateActivityQuery = (data, queryParams) => {
  const errors = [];

  // Support both direct calls validateActivityQuery(query) and middleware calls validate(validateActivityQuery)
  const query =
    queryParams !== undefined && queryParams !== null
      ? queryParams
      : data || {};

  const { page, limit, search, action, entityType } = query;

  // Validate page
  if (page !== undefined && page !== '') {
    const pageNum = Number(page);
    if (isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum <= 0) {
      errors.push('Page must be a positive integer');
    }
  }

  // Validate limit
  if (limit !== undefined && limit !== '') {
    const limitNum = Number(limit);
    if (isNaN(limitNum) || !Number.isInteger(limitNum) || limitNum <= 0) {
      errors.push('Limit must be a positive integer');
    }
  }

  // Validate search
  if (search !== undefined && typeof search !== 'string') {
    errors.push('Search must be a string');
  }

  // Validate action
  if (
    action !== undefined &&
    action !== '' &&
    !Object.values(ACTIVITY_ACTIONS).includes(action)
  ) {
    errors.push('Invalid activity action');
  }

  // Validate entityType
  if (
    entityType !== undefined &&
    entityType !== '' &&
    !Object.values(ENTITY_TYPES).includes(entityType)
  ) {
    errors.push('Invalid entity type');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  const cleanQuery = {};

  if (page !== undefined && page !== '') {
    cleanQuery.page = Number(page);
  }

  if (limit !== undefined && limit !== '') {
    cleanQuery.limit = Number(limit);
  }

  if (search !== undefined && typeof search === 'string') {
    cleanQuery.search = search.trim();
  }

  if (action !== undefined && action !== '') {
    cleanQuery.action = action;
  }

  if (entityType !== undefined && entityType !== '') {
    cleanQuery.entityType = entityType;
  }

  return {
    value: {
      query: cleanQuery
    }
  };
};

module.exports = {
  validateActivityQuery
};
