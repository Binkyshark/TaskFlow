const notificationService = require('./notification.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class NotificationController {
  createNotification = catchAsync(async (req, res) => {
    const notification = await notificationService.createNotification(req.user.id, req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Notification created successfully',
      data: { notification }
    });
  });

  getUserNotifications = catchAsync(async (req, res) => {
    const { notifications, unreadCount, meta } = await notificationService.getUserNotifications(req.user.id, req.query);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Notifications retrieved successfully',
      data: { notifications, unreadCount },
      meta
    });
  });

  markAsRead = catchAsync(async (req, res) => {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Notification marked as read',
      data: { notification }
    });
  });

  markAllAsRead = catchAsync(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: result.message
    });
  });
}

module.exports = new NotificationController();
