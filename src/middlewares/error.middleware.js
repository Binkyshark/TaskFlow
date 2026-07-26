/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || 'Internal Server Error';

  console.error('Error Trace:', err);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return res.status(404).json({ success: false, message });
  }

  // Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate field value entered for ${field}. Please use another value.`;
    return res.status(400).json({ success: false, message });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // JsonWebTokenError
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token signature.' });
  }

  // TokenExpiredError
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token has expired.' });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
