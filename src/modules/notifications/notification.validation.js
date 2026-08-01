const {
  NOTIFICATION_TYPES
} = require('./notification.model');

const validateCreateNotification = (data) => {
  const errors = [];

  const {
    recipientId,
    title,
    message,
    type,
    project,
    board,
    task,
    comment,
    attachment,
    link,
    metadata
  } = data || {};

  if (!recipientId) {
    errors.push('recipientId is required');
  }

  if (
    !title ||
    typeof title !== 'string' ||
    !title.trim()
  ) {
    errors.push('Notification title is required');
  }

  if (
    !message ||
    typeof message !== 'string' ||
    !message.trim()
  ) {
    errors.push('Notification message is required');
  }

  if (
    type &&
    !Object.values(NOTIFICATION_TYPES).includes(type)
  ) {
    errors.push('Invalid notification type');
  }

  if (errors.length > 0) {
    return {
      error: errors
    };
  }

  return {
    value: {
      body: {
        recipientId,

        title: title.trim(),

        message: message.trim(),

        type:
          type || NOTIFICATION_TYPES.GENERAL,

        project,

        board,

        task,

        comment,

        attachment,

        link: link || '',

        metadata: metadata || {}
      }
    }
  };
};

module.exports = {
  validateCreateNotification
};