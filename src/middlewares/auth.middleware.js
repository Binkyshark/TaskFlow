
const { User } = require('../modules/users/user.model');
const { verifyToken } = require('../utils/jwt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * Protect Routes
 * Verify JWT and attach current user to request
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError(
      'Not authorized to access this route. Token missing.',
      401
    );
  }

  const decoded = verifyToken(token);

  const currentUser = await User.findById(decoded.sub);

  if (!currentUser) {
    throw new AppError(
      'The user belonging to this token no longer exists.',
      401
    );
  }

  if (!currentUser.isActive) {
    throw new AppError(
      'Your account has been deactivated.',
      403
    );
  }

  req.user = currentUser;

  next();
});

/**
 * Restrict route access to specific roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action.',
        403
      );
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo
};