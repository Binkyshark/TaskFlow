const express = require('express');

const notificationController = require('./notification.controller');

const {
  protect
} = require('../../middlewares/auth.middleware');

const validate = require('../../middlewares/validation.middleware');

const {
  validateCreateNotification
} = require('./notification.validation');

const router = express.Router();

router.use(protect);

/*
|--------------------------------------------------------------------------
| Notification CRUD
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  validate(validateCreateNotification),
  notificationController.createNotification
);

router.get(
  '/',
  notificationController.getUserNotifications
);

router.get(
  '/:id',
  notificationController.getNotificationById
);

router.patch(
  '/read-all',
  notificationController.markAllAsRead
);

router.patch(
  '/:id/read',
  notificationController.markAsRead
);

router.delete(
  '/:id',
  notificationController.deleteNotification
);

module.exports = router;