// const validateCreateProject = (data) => {
//   const errors = [];
//   const { name, description } = data || {};

//   if (!name || typeof name !== 'string' || !name.trim()) {
//     errors.push('Project name is required');
//   }

//   if (typeof name === 'string' && name.trim().length < 3) {
//   errors.push('Project name must be at least 3 characters');
// }

//   if (errors.length > 0) {
//     return { error: errors };
//   }

//   return {
//     value: {
//       body: {
//         name: name.trim(),
//         description: description ? description.trim() : ''
//       }
//     }
//   };
// };

// const validateUpdateProject = (data) => {
//   const errors = [];
//   const { name, description, isArchived } = data || {};

//   if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
//     errors.push('Project name cannot be empty');
//   }

//   if (errors.length > 0) {
//     return { error: errors };
//   }

//   const cleanBody = {};
//   if (name !== undefined) cleanBody.name = name.trim();
//   if (description !== undefined) cleanBody.description = description.trim();
//   if (isArchived !== undefined) cleanBody.isArchived = Boolean(isArchived);

//   return { value: { body: cleanBody } };
// };

// const validateAddMember = (data) => {
//   const errors = [];
//   const { userId, role } = data || {};

//   if (!userId) {
//     errors.push('userId is required');
//   }

//   if (role && !['admin', 'member'].includes(role)) {
//     errors.push('Role must be either admin or member');
//   }

//   if (errors.length > 0) {
//     return { error: errors };
//   }

//   return {
//     value: {
//       body: {
//         userId,
//         role: role || 'member'
//       }
//     }
//   };
// };

// module.exports = {
//   validateCreateProject,
//   validateUpdateProject,
//   validateAddMember
// };
const PROJECT_MEMBER_ROLES = ['admin', 'member'];

const validateCreateProject = (data) => {
  const errors = [];
  const { name, description } = data || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Project name is required');
  }

  if (typeof name === 'string') {
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      errors.push('Project name must be at least 3 characters');
    }

    if (trimmedName.length > 100) {
      errors.push('Project name cannot exceed 100 characters');
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push('Description must be a string');
    } else if (description.trim().length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    }
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

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      errors.push('Project name cannot be empty');
    } else {
      const trimmedName = name.trim();

      if (trimmedName.length < 3) {
        errors.push('Project name must be at least 3 characters');
      }

      if (trimmedName.length > 100) {
        errors.push('Project name cannot exceed 100 characters');
      }
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push('Description must be a string');
    } else if (description.trim().length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    }
  }

  if (isArchived !== undefined && typeof isArchived !== 'boolean') {
    errors.push('isArchived must be a boolean');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  const cleanBody = {};

  if (name !== undefined) {
    cleanBody.name = name.trim();
  }

  if (description !== undefined) {
    cleanBody.description = description.trim();
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

const validateAddMember = (data) => {
  const errors = [];
  const { userId, role } = data || {};

  if (!userId) {
    errors.push('userId is required');
  } else if (typeof userId !== 'string') {
    errors.push('userId must be a string');
  }

  if (role && !PROJECT_MEMBER_ROLES.includes(role)) {
    errors.push('Role must be either admin or member');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        userId,
        role: role || PROJECT_MEMBER_ROLES[1]
      }
    }
  };
};

module.exports = {
  validateCreateProject,
  validateUpdateProject,
  validateAddMember
};