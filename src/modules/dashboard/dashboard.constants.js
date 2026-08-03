/*
|--------------------------------------------------------------------------
| Dashboard Module Constants
|--------------------------------------------------------------------------
| Reusable constants for the Dashboard aggregation module.
| Avoids magic numbers and hardcoded strings.
*/

/**
 * Limit defaults and maximum bounds
 */
const DASHBOARD_LIMITS = Object.freeze({
  OVERVIEW_MAX_ITEMS: 10,
  RECENT_ACTIVITIES_LIMIT: 10,
  MY_TASKS_LIMIT: 10,
  DUE_SOON_LIMIT: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 10
});

/**
 * Default parameters for dashboard aggregations
 */
const DASHBOARD_DEFAULTS = Object.freeze({
  DEFAULT_DUE_SOON_DAYS: 7,
  DEFAULT_SORT_FIELD: 'dueDate',
  DEFAULT_SORT_ORDER: 'asc'
});

/**
 * Identifiers for dashboard sections
 */
const DASHBOARD_SECTIONS = Object.freeze({
  OVERVIEW: 'overview',
  RECENT_ACTIVITIES: 'recent_activities',
  MY_TASKS: 'my_tasks',
  DUE_SOON: 'due_soon'
});

/**
 * Available sorting options for task queries
 */
const TASK_SORT_OPTIONS = Object.freeze({
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt'
});

/**
 * Available sorting options for activity queries
 */
const ACTIVITY_SORT_OPTIONS = Object.freeze({
  CREATED_AT: 'createdAt'
});

module.exports = {
  DASHBOARD_LIMITS,
  DASHBOARD_DEFAULTS,
  DASHBOARD_SECTIONS,
  TASK_SORT_OPTIONS,
  ACTIVITY_SORT_OPTIONS
};
