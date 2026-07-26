const validateCreateProject = (data) => {
  const errors = [];
  const { name, description } = data || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Project name is required');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        name: name.trim(),
        description: description ? description.trim() : ''
      }
    }
  };
};

const validateUpdateProject = (data) => {
  const errors = [];
  const { name, description, isArchived } = data || {};

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    errors.push('Project name cannot be empty');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  const cleanBody = {};
  if (name !== undefined) cleanBody.name = name.trim();
  if (description !== undefined) cleanBody.description = description.trim();
  if (isArchived !== undefined) cleanBody.isArchived = Boolean(isArchived);

  return { value: { body: cleanBody } };
};

const validateAddMember = (data) => {
  const errors = [];
  const { userId, role } = data || {};

  if (!userId) {
    errors.push('userId is required');
  }

  if (role && !['admin', 'member'].includes(role)) {
    errors.push('Role must be either admin or member');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        userId,
        role: role || 'member'
      }
    }
  };
};

module.exports = {
  validateCreateProject,
  validateUpdateProject,
  validateAddMember
};
