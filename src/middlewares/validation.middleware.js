/**
 * Schema validation runner middleware
 * Allows validation schemas (custom or Joi/Zod like functions) to validate request data
 */
const validate = (schema) => (req, res, next) => {
  if (typeof schema !== 'function') {
    return next();
  }

  const { error, value } = schema(req.body, req.query, req.params);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error
    });
  }

  // Assign cleaned values back if returned
  if (value) {
    if (value.body) req.body = value.body;
    if (value.query) req.query = value.query;
    if (value.params) req.params = value.params;
  }

  next();
};

module.exports = validate;
