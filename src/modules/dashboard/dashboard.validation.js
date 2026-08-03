const {
  DASHBOARD_LIMITS,
  DASHBOARD_DEFAULTS
} = require('./dashboard.constants');

/**
 * Validate dashboard query parameters
 */
const validateDashboardQuery = (data) => {
  const errors = [];

  const page =
    data.page !== undefined
      ? Number(data.page)
      : 1;

  const limit =
    data.limit !== undefined
      ? Number(data.limit)
      : DASHBOARD_DEFAULTS.DEFAULT_PAGE_SIZE;

  if (Number.isNaN(page) || page < 1) {
    errors.push('page must be a positive integer');
  }

  if (Number.isNaN(limit) || limit < 1) {
    errors.push('limit must be a positive integer');
  }

  if (limit > DASHBOARD_LIMITS.MAX_PAGE_SIZE) {
    errors.push(
      `limit cannot exceed ${DASHBOARD_LIMITS.MAX_PAGE_SIZE}`
    );
  }

  if (errors.length > 0) {
    return {
      error: errors
    };
  }

  return {
    value: {
      query: {
        page,
        limit
      }
    }
  };
};

/**
 * Validate Due Soon endpoint query
 */
const validateDueSoonQuery = (data) => {
  const errors = [];

  const page =
    data.page !== undefined
      ? Number(data.page)
      : 1;

  const limit =
    data.limit !== undefined
      ? Number(data.limit)
      : DASHBOARD_DEFAULTS.DEFAULT_PAGE_SIZE;

  const days =
    data.days !== undefined
      ? Number(data.days)
      : DASHBOARD_DEFAULTS.DEFAULT_DUE_SOON_DAYS;

  if (Number.isNaN(page) || page < 1) {
    errors.push('page must be a positive integer');
  }

  if (Number.isNaN(limit) || limit < 1) {
    errors.push('limit must be a positive integer');
  }

  if (limit > DASHBOARD_LIMITS.MAX_PAGE_SIZE) {
    errors.push(
      `limit cannot exceed ${DASHBOARD_LIMITS.MAX_PAGE_SIZE}`
    );
  }

  if (Number.isNaN(days) || days < 1) {
    errors.push('days must be a positive integer');
  }

  if (errors.length > 0) {
    return {
      error: errors
    };
  }

  return {
    value: {
      query: {
        page,
        limit,
        days
      }
    }
  };
};

module.exports = {
  validateDashboardQuery,
  validateDueSoonQuery
};