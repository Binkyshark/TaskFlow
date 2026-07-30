const validateCreateList = (data) => {
  const errors = [];
  const { title, position } = data || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('List title is required');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        title: title.trim(),
        position: position !== undefined ? Number(position) : undefined
      }
    }
  };
};

const validateUpdateList = (data) => {
  const errors = [];
  const { title, position } = data || {};

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    errors.push('List title cannot be empty');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  const cleanBody = {};
  if (title !== undefined) cleanBody.title = title.trim();
  if (position !== undefined) cleanBody.position = Number(position);

  return { value: { body: cleanBody } };
};

module.exports = {
  validateCreateList,
  validateUpdateList
};
