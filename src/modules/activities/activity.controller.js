const activityService = require('./activity.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class ActivityController {
  /*
  |--------------------------------------------------------------------------
  | Get User Activities
  |--------------------------------------------------------------------------
  */

  getUserActivities = catchAsync(async (req, res) => {
    const { activities, meta } = await activityService.getUserActivities(
      req.user.id,
      req.query
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'User activities retrieved successfully',
      data: {
        activities
      },
      meta
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Get Project Activities
  |--------------------------------------------------------------------------
  */

  getProjectActivities = catchAsync(async (req, res) => {
    const { activities, meta } = await activityService.getProjectActivities(
      req.params.projectId,
      req.user.id,
      req.query
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Project activities retrieved successfully',
      data: {
        activities
      },
      meta
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Get Board Activities
  |--------------------------------------------------------------------------
  */

  getBoardActivities = catchAsync(async (req, res) => {
    const { activities, meta } = await activityService.getBoardActivities(
      req.params.boardId,
      req.user.id,
      req.query
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Board activities retrieved successfully',
      data: {
        activities
      },
      meta
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Get Task Activities
  |--------------------------------------------------------------------------
  */

  getTaskActivities = catchAsync(async (req, res) => {
    const { activities, meta } = await activityService.getTaskActivities(
      req.params.taskId,
      req.user.id,
      req.query
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Task activities retrieved successfully',
      data: {
        activities
      },
      meta
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Get Activity By Id
  |--------------------------------------------------------------------------
  */

  getActivityById = catchAsync(async (req, res) => {
    const activity = await activityService.getActivityById(
      req.params.id,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Activity retrieved successfully',
      data: {
        activity
      }
    });
  });
}

module.exports = new ActivityController();
