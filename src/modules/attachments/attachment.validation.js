const validateUploadAttachment = (data) => {
  const errors = [];
  const { taskId } = data || {};

  if (!taskId) {
    errors.push('taskId is required');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: { taskId }
    }
  };
};

module.exports = {
  validateUploadAttachment
};
