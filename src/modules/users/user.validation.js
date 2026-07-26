
const validateUpdateProfile = (data) => {
  const errors = [];
  const cleanBody = {};

  const allowedFields = ['fullName'];
  const receivedFields = Object.keys(data || {});

  // Reject unknown fields
  const invalidFields = receivedFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    errors.push(
      `Invalid field(s): ${invalidFields.join(', ')}`
    );
  }

  // Validate fullName
  if (data.fullName !== undefined) {
    if (typeof data.fullName !== 'string') {
      errors.push('Full name must be a string');
    } else {
      const fullName = data.fullName.trim();

      if (fullName.length < 2) {
        errors.push('Full name must be at least 2 characters');
      }

      if (fullName.length > 50) {
        errors.push('Full name must not exceed 50 characters');
      }

      cleanBody.fullName = fullName;
    }
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: cleanBody,
    },
  };
};

module.exports = {
  validateUpdateProfile,
};