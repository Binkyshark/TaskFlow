const Notification = require('./notification.model');
const { getPagination, getPagingData } = require('../../utils/pagination');

class NotificationService {
  /**
   * Create system/user notification
   */
  async createNotification(senderId, data) {
    const { recipientId, title, message, type, link } = data;

    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      title,
      message,
      type,
      link
    });

    return notification.populate('sender', 'name email avatar');
  }

  /**
   * Get notifications for authenticated user
   */
  async getUserNotifications(userId, query) {
    const { page, limit, skip } = getPagination(query);
    const filter = { recipient: userId };

    if (query.unreadOnly === 'true') {
      filter.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .populate('sender', 'name email avatar')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: userId, read: false })
    ]);

    const meta = getPagingData(total, page, limit);
    return { notifications, unreadCount, meta };
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }

    if (notification.recipient.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    notification.read = true;
    await notification.save();
    return notification;
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId) {
    await Notification.updateMany({ recipient: userId, read: false }, { read: true });
    return { message: 'All notifications marked as read' };
  }
}

module.exports = new NotificationService();
