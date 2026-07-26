
const { User } = require('./user.model');
const AppError = require('../../utils/AppError');
const { getPagination, getPagingData } = require('../../utils/pagination');

class UserService {
  /**
   * Get all users with pagination and search
   */
  async getAllUsers(query) {
    const { page, limit, skip } = getPagination(query);

    const filter = {};

    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter)
    ]);

    return {
      users,
      meta: getPagingData(total, page, limit)
    };
  }

  /**
   * Get single user by ID
   */
  // async getUserById(userId) {
  //   const user = await User.findById(userId);

  //   if (!user) {
  //     throw new AppError('User not found', 404);
  //   }

  //   return user;
  // }
  async getUserById(userId) {
    console.log('========================');
    console.log('Incoming userId:', userId);
    console.log('Type:', typeof userId);

    const user = await User.findById(userId);

    console.log('Mongo result:', user);
    console.log('========================');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
  /**
   * Update user profile
   */

  async updateProfile(userId, updateData, avatarFile) {
    const user = await this.getUserById(userId);

    // Only allow updating specific fields
    const allowedFields = ['fullName'];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    }

    if (avatarFile) {
      // TODO:
      // Delete old avatar from disk/cloud storage
      user.avatar = avatarFile.path;
    }

    await user.save();

    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = await this.getUserById(userId);

    // Future:
    // Soft Delete
    // user.deletedAt = new Date();
    // await user.save();

    await user.deleteOne();

    return {
      message: 'User deleted successfully'
    };
  }
}

module.exports = new UserService();
