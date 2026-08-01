const mongoose = require('mongoose');

const {
  Notification,
  NOTIFICATION_TYPES
} = require('./notification.model');

const { getPagination, getPagingData } = require('../../utils/pagination');

const NOTIFICATION_POPULATE = [
  {
    path: 'sender',
    select: 'name email avatar'
  },
  {
    path: 'project',
    select: 'name'
  },
  {
    path: 'board',
    select: 'title'
  },
  {
    path: 'task',
    select: 'title'
  },
  {
    path: 'comment',
    select: 'content'
  },
  {
    path: 'attachment',
    select: 'originalName'
  }
];

class NotificationService {
  /*
  |--------------------------------------------------------------------------
  | Generic Create Notification
  |--------------------------------------------------------------------------
  */

  async createNotification(senderId, data) {
    const notification = await Notification.create({
      sender: senderId,
      recipient: data.recipientId,

      title: data.title,
      message: data.message,

      type: data.type || NOTIFICATION_TYPES.GENERAL,

      project: data.project,
      board: data.board,
      task: data.task,
      comment: data.comment,
      attachment: data.attachment,

      link: data.link || '',
      metadata: data.metadata || {}
    });

    return notification.populate(
      NOTIFICATION_POPULATE
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Get Notifications
  |--------------------------------------------------------------------------
  */

  async getUserNotifications(userId, query) {
    const { page, limit, skip } =
      getPagination(query);

    const filter = {
      recipient: userId
    };

    if (query.unreadOnly === 'true') {
      filter.isRead = false;
    }

    if (query.type) {
      filter.type = query.type;
    }

    const [
      notifications,
      total,
      unreadCount
    ] = await Promise.all([
      Notification.find(filter)
        .populate(NOTIFICATION_POPULATE)
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(limit),

      Notification.countDocuments(filter),

      Notification.countDocuments({
        recipient: userId,
        isRead: false
      })
    ]);

    return {
      notifications,
      unreadCount,
      meta: getPagingData(
        total,
        page,
        limit
      )
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Get Notification
  |--------------------------------------------------------------------------
  */

  async getNotificationById(
    notificationId,
    userId
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(
        notificationId
      )
    ) {
      const error = new Error(
        'Invalid notification ID'
      );

      error.statusCode = 400;

      throw error;
    }

    const notification =
      await Notification.findById(
        notificationId
      ).populate(NOTIFICATION_POPULATE);

    if (!notification) {
      const error = new Error(
        'Notification not found'
      );

      error.statusCode = 404;

      throw error;
    }

    if (
      notification.recipient.toString() !==
      userId.toString()
    ) {
      const error = new Error(
        'Not authorized'
      );

      error.statusCode = 403;

      throw error;
    }

    return notification;
  }

  /*
  |--------------------------------------------------------------------------
  | Mark As Read
  |--------------------------------------------------------------------------
  */

  async markAsRead(
    notificationId,
    userId
  ) {
    const notification =
      await this.getNotificationById(
        notificationId,
        userId
      );

    notification.isRead = true;

    notification.readAt = new Date();

    await notification.save();

    return notification;
  }

  /*
  |--------------------------------------------------------------------------
  | Mark All As Read
  |--------------------------------------------------------------------------
  */

  async markAllAsRead(userId) {
    await Notification.updateMany(
      {
        recipient: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    return {
      message:
        'All notifications marked as read'
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Notification
  |--------------------------------------------------------------------------
  */

  async deleteNotification(
    notificationId,
    userId
  ) {
    const notification =
      await this.getNotificationById(
        notificationId,
        userId
      );

    await notification.deleteOne();

    return {
      message:
        'Notification deleted successfully'
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Helper Methods
  |--------------------------------------------------------------------------
  */

  async notifyTaskAssigned(
    senderId,
    recipientId,
    task
  ) {
    return this.createNotification(
      senderId,
      {
        recipientId,

        title: 'Task Assigned',

        message: `You have been assigned to "${task.title}".`,

        type:
          NOTIFICATION_TYPES.TASK_ASSIGNED,

        task: task._id,

        board: task.board,

        project: task.project,

        link: `/tasks/${task._id}`
      }
    );
  }

  async notifyCommentAdded(
    senderId,
    recipientId,
    task,
    comment
  ) {
    return this.createNotification(
      senderId,
      {
        recipientId,

        title: 'New Comment',

        message:
          'Someone commented on your task.',

        type:
          NOTIFICATION_TYPES.COMMENT_ADDED,

        task: task._id,

        board: task.board,

        project: task.project,

        comment: comment._id,

        link: `/tasks/${task._id}`
      }
    );
  }

  async notifyAttachmentUploaded(
    senderId,
    recipientId,
    task,
    attachment
  ) {
    return this.createNotification(
      senderId,
      {
        recipientId,

        title: 'Attachment Uploaded',

        message:
          'A new attachment has been uploaded.',

        type:
          NOTIFICATION_TYPES.ATTACHMENT_UPLOADED,

        task: task._id,

        board: task.board,

        project: task.project,

        attachment: attachment._id,

        link: `/tasks/${task._id}`
      }
    );
  }
}

module.exports =
  new NotificationService();
