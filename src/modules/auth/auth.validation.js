const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
const PASSWORD_NUMBER_REGEX = /[0-9]/;
const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

/**
 * Express Middleware: Validate & Sanitize Register Payload
 * Endpoint: POST /auth/register
 */
const validateRegister = (req, res, next) => {
  const errors = [];
  const body = req.body || {};

  // 1. Strict Whitelisting: Reject Unknown Fields
  const allowedFields = ['fullName', 'email', 'password'];
  const receivedFields = Object.keys(body);
  const unknownFields = receivedFields.filter((field) => !allowedFields.includes(field));

  for (const field of unknownFields) {
    errors.push({ field, message: `Field '${field}' is not allowed` });
  }

  const { fullName, email, password } = body;

  // 2. fullName Validation
  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  } else {
    const trimmedName = fullName.trim();
    if (trimmedName.length < 2) {
      errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters long' });
    } else if (trimmedName.length > 50) {
      errors.push({ field: 'fullName', message: 'Full name cannot exceed 50 characters' });
    }
  }

  // 3. email Validation
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  // 4. password Validation (Do NOT trim password)
  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }
    if (password.length > 128) {
      errors.push({ field: 'password', message: 'Password cannot exceed 128 characters' });
    }
    if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
    }
    if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
    }
    if (!PASSWORD_NUMBER_REGEX.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one numeric character' });
    }
    if (!PASSWORD_SPECIAL_REGEX.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one special character' });
    }
  }

  // Handle Validation Failures
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors
    });
  }

  // Sanitize & Reassign Whitelisted Values to req.body
  req.body = {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    password
  };

  next();
};

/**
 * Express Middleware: Validate & Sanitize Login Payload
 * Endpoint: POST /auth/login
 */
const validateLogin = (req, res, next) => {
  const errors = [];
  const body = req.body || {};

  // 1. Strict Whitelisting: Reject Unknown Fields
  const allowedFields = ['email', 'password'];
  const receivedFields = Object.keys(body);
  const unknownFields = receivedFields.filter((field) => !allowedFields.includes(field));

  for (const field of unknownFields) {
    errors.push({ field, message: `Field '${field}' is not allowed` });
  }

  const { email, password } = body;

  // 2. email Validation
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  // 3. password Validation
  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  // Handle Validation Failures
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors
    });
  }

  // Sanitize & Reassign Whitelisted Values to req.body
  req.body = {
    email: email.trim().toLowerCase(),
    password
  };

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
