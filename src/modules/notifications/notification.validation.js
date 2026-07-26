const validateCreateNotification = (data) => {
  const errors = [];
  const { recipientId, title, message, type, link } = data || {};

  if (!recipientId) {
    errors.push('recipientId is required');
  }

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Notification title is required');
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.push('Notification message is required');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        recipientId,
        title: title.trim(),
        message: message.trim(),
        type: type || 'general',
        link: link || ''
      }
    }
  };
};

module.exports = {
  validateCreateNotification
};
