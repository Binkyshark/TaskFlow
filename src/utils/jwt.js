const jwt = require('jsonwebtoken');

/**
 * Generate signed JWT Token
 * Fails strictly if JWT_SECRET is missing from environment variables
 */
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from environment variables');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify JWT Token
 * Fails strictly if JWT_SECRET is missing from environment variables
 */
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from environment variables');
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
