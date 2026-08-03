const express = require('express');
const activityController = require('./activity.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const { validateActivityQuery } = require('./activity.validation');

const router = express.Router({
  mergeParams: true
});

router.use(protect);

/*
|--------------------------------------------------------------------------
| Activity Query Dispatcher / Activity List
|--------------------------------------------------------------------------
*/

const handleGetActivities = (req, res, next) => {
  if (req.params.projectId) {
    return activityController.getProjectActivities(req, res, next);
  }

  if (req.params.boardId) {
    return activityController.getBoardActivities(req, res, next);
  }

  if (req.params.taskId) {
    return activityController.getTaskActivities(req, res, next);
  }

  return activityController.getUserActivities(req, res, next);
};

// Bind getActivities to controller if not already bound
if (!activityController.getActivities) {
  activityController.getActivities = handleGetActivities;
}

/*
|--------------------------------------------------------------------------
| Activity Routes
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  validate(validateActivityQuery),
  handleGetActivities
);

router.get(
  '/:id',
  activityController.getActivityById
);

module.exports = router;
