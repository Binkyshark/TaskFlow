const dashboardService = require('./dashboard.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class DashboardController {
  /**
   * Get complete dashboard
   * GET /dashboard
   */
  getDashboard = catchAsync(async (req, res) => {
    const dashboard = await dashboardService.getDashboard(req.user.id);

    return sendResponse(res, {
      statusCode: 200,
      message: 'Dashboard retrieved successfully',
      data: dashboard
    });
  });

  /**
   * Get overview statistics
   * GET /dashboard/overview
   */
  getOverview = catchAsync(async (req, res) => {
    const overview = await dashboardService.getOverview(req.user.id);

    return sendResponse(res, {
      statusCode: 200,
      message: 'Dashboard overview retrieved successfully',
      data: {
        overview
      }
    });
  });

  /**
   * Get recent activities
   * GET /dashboard/recent-activities
   */
  getRecentActivities = catchAsync(async (req, res) => {
    const recentActivities = await dashboardService.getRecentActivities(
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Recent activities retrieved successfully',
      data: {
        recentActivities
      }
    });
  });

  /**
   * Get tasks assigned to current user
   * GET /dashboard/my-tasks
   */
  getMyTasks = catchAsync(async (req, res) => {
    const myTasks = await dashboardService.getMyTasks(req.user.id);

    return sendResponse(res, {
      statusCode: 200,
      message: 'My tasks retrieved successfully',
      data: {
        myTasks
      }
    });
  });

  /**
   * Get tasks due soon
   * GET /dashboard/due-soon
   */
  getDueSoon = catchAsync(async (req, res) => {
    const dueSoon = await dashboardService.getDueSoon(req.user.id);

    return sendResponse(res, {
      statusCode: 200,
      message: 'Due soon tasks retrieved successfully',
      data: {
        dueSoon
      }
    });
  });
}

module.exports = new DashboardController();