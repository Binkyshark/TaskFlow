const bcrypt = require('bcryptjs');

/**
 * Hash raw plaintext password
 * Reads salt rounds from process.env.BCRYPT_SALT_ROUNDS (default: 10)
 */
const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

/**
 * Compare candidate password with stored password hash
 */
const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
