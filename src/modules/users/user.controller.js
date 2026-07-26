const userService = require('./user.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class UserController {
  getAllUsers = catchAsync(async (req, res) => {
    const { users, meta } = await userService.getAllUsers(req.query);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: { users },
      meta
    });
  });

  getUserById = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return sendResponse(res, {
      statusCode: 200,
      message: 'User retrieved successfully',
      data: { user }
    });
  });

  updateProfile = catchAsync(async (req, res) => {
    console.log('======================');
    console.log('req.user =', req.user);
    console.log('req.user.id =', req.user.id);
    console.log('req.user._id =', req.user._id);
    console.log('======================');

    const user = await userService.updateProfile(
      req.user.id,
      req.body,
      req.file
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Profile updated successfully',
      data: { user }
    });
  });

  deleteUser = catchAsync(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    return sendResponse(res, {
      statusCode: 200,
      message: result.message
    });
  });
}

module.exports = new UserController();
