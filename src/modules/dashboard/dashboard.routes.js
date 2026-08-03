const express = require('express');

const dashboardController = require('./dashboard.controller');

const { protect } = require('../../middlewares/auth.middleware');

const validate = require('../../middlewares/validation.middleware');

const {
  validateDashboardQuery,
  validateDueSoonQuery
} = require('./dashboard.validation');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(protect);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  dashboardController.getDashboard
);

router.get(
  '/overview',
  dashboardController.getOverview
);

router.get(
  '/recent-activities',
  validate(validateDashboardQuery),
  dashboardController.getRecentActivities
);

router.get(
  '/my-tasks',
  validate(validateDashboardQuery),
  dashboardController.getMyTasks
);

router.get(
  '/due-soon',
  validate(validateDueSoonQuery),
  dashboardController.getDueSoon
);

module.exports = router;