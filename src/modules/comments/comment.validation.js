const validateCreateComment = (data) => {
  const errors = [];

  const { content } = data || {};

  if (
    !content ||
    typeof content !== 'string' ||
    !content.trim()
  ) {
    errors.push('Comment content is required');
  }

  if (errors.length) {
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

const validateUpdateComment = (data) => {
  const errors = [];

  const { content } = data || {};

  if (
    content !== undefined &&
    (typeof content !== 'string' || !content.trim())
  ) {
    errors.push('Comment content cannot be empty');
  }

  if (errors.length) {
    return { error: errors };
  }

  const cleanBody = {};

  if (content !== undefined) {
    cleanBody.content = content.trim();
  }

  return {
    value: {
      body: cleanBody
    }
  };
};

module.exports = {
  validateCreateComment,
  validateUpdateComment
};
