const validateCreateBoard = (data) => {
  const errors = [];
  const { title, projectId, description } = data || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Board title is required');
  }

  if (!projectId) {
    errors.push('projectId is required');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        title: title.trim(),
        projectId,
        description: description ? description.trim() : ''
      }
    }
  };
};

const validateUpdateBoard = (data) => {
  const errors = [];
  const { title, description, position } = data || {};

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    errors.push('Board title cannot be empty');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  const cleanBody = {};
  if (title !== undefined) cleanBody.title = title.trim();
  if (description !== undefined) cleanBody.description = description.trim();
  if (position !== undefined) cleanBody.position = Number(position);

  return { value: { body: cleanBody } };
};

module.exports = {
  validateCreateBoard,
  validateUpdateBoard
};
