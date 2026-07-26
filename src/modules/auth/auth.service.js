const { User } = require('../users/user.model');
const { hashPassword, comparePassword } = require('../../utils/bcrypt');
const { generateToken } = require('../../utils/jwt');
const AppError = require('../../utils/AppError');

// ==========================================
// PRIVATE SINGLE-RESPONSIBILITY HELPERS
// ==========================================

/**
 * Pre-check email existence in database
 */
const checkEmailExists = async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }
};

/**
 * Create user in database and handle MongoDB E11000 duplicate key race conditions
 */
const createUser = async (fullName, email, hashedPassword) => {
  try {
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('User with this email already exists', 400);
    }
    throw error;
  }
};

/**
 * Find user by email with password field explicitly populated
 */
const findUserByEmailWithPassword = async (email) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  return user;
};

/**
 * Verify account active state using early return guard
 */
const checkUserIsActive = (user) => {
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }
};

/**
 * Compare candidate password against stored hash using constant-time evaluation
 */
const compareUserPasswords = async (candidatePassword, hashedPassword) => {
  const isMatch = await comparePassword(candidatePassword, hashedPassword);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }
};

/**
 * Generate Auth Token for User
 */
const createAuthToken = (user) => {
  const payload = {
    sub: user.id || user._id,
    role: user.role
  };
  return generateToken(payload);
};

// ==========================================
// PUBLIC BUSINESS WORKFLOWS
// ==========================================

/**
 * Register Workflow
 */
const register = async ({ fullName, email, password }) => {
  await checkEmailExists(email);
  const hashedPassword = await hashPassword(password);
  const user = await createUser(fullName, email, hashedPassword);
  const token = createAuthToken(user);

  return {
    user: user.toJSON(),
    token
  };
};

/**
 * Login Workflow
 */
const login = async ({ email, password }) => {
  const user = await findUserByEmailWithPassword(email);
  checkUserIsActive(user);
  await compareUserPasswords(password, user.password);
  const token = createAuthToken(user);

  return {
    user: user.toJSON(),
    token
  };
};

module.exports = {
  register,
  login
};
