const validateCreateComment = (data) => {
  const errors = [];
  const { content, taskId } = data || {};

  if (!content || typeof content !== 'string' || !content.trim()) {
    errors.push('Comment content is required');
  }

  if (!taskId) {
    errors.push('taskId is required');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        content: content.trim(),
        taskId
      }
    }
  };
};

const validateUpdateComment = (data) => {
  const errors = [];
  const { content } = data || {};

  if (!content || typeof content !== 'string' || !content.trim()) {
    errors.push('Comment content cannot be empty');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        content: content.trim()
      }
    }
  };
};

module.exports = {
  validateCreateComment,
  validateUpdateComment
};
