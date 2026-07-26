const authService = require('./auth.service');
const catchAsync = require('../../utils/catchAsync');

/**
 * Register User Controller Handler
 * Endpoint: POST /api/v1/auth/register
 */
const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  });
});

/**
 * Login User Controller Handler
 * Endpoint: POST /api/v1/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user,
      token
    }
  });
});

module.exports = {
  register,
  login
};
