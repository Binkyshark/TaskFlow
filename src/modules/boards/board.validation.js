const validateCreateBoard = (data) => {
  const errors = [];
  const { title, description } = data || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Board title is required');
  }

  if (title && title.trim().length < 3) {
    errors.push('Board title must be at least 3 characters');
  }

  if (title && title.trim().length > 100) {
    errors.push('Board title cannot exceed 100 characters');
  }

  if (
    description !== undefined &&
    typeof description !== 'string'
  ) {
    errors.push('Description must be a string');
  }

  if (
    description &&
    description.length > 1000
  ) {
    errors.push('Description cannot exceed 1000 characters');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        title: title.trim(),
        description: description ? description.trim() : ''
      }
    }
  };
};

const validateUpdateBoard = (data) => {
  const errors = [];
  const { title, description, position, isArchived } = data || {};

  if (
    title !== undefined &&
    (typeof title !== 'string' || !title.trim())
  ) {
    errors.push('Board title cannot be empty');
  }

  if (
    title &&
    title.trim().length < 3
  ) {
    errors.push('Board title must be at least 3 characters');
  }

  if (
    title &&
    title.trim().length > 100
  ) {
    errors.push('Board title cannot exceed 100 characters');
  }

  if (
    description !== undefined &&
    typeof description !== 'string'
  ) {
    errors.push('Description must be a string');
  }

  if (
    description &&
    description.length > 1000
  ) {
    errors.push('Description cannot exceed 1000 characters');
  }

  if (
    position !== undefined &&
    (!Number.isInteger(Number(position)) || Number(position) < 0)
  ) {
    errors.push('Position must be a non-negative integer');
  }

  if (
    isArchived !== undefined &&
    typeof isArchived !== 'boolean'
  ) {
    errors.push('isArchived must be a boolean');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  const cleanBody = {};

  if (title !== undefined) {
    cleanBody.title = title.trim();
  }

  if (description !== undefined) {
    cleanBody.description = description.trim();
  }

  if (position !== undefined) {
    cleanBody.position = Number(position);
  }

  if (isArchived !== undefined) {
    cleanBody.isArchived = isArchived;
  }

  return {
    value: {
      body: cleanBody
    }
  };
};

module.exports = {
  validateCreateBoard,
  validateUpdateBoard
};
