const express = require('express');
const userController = require('./user.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const { handleSingleUpload } = require('../../middlewares/upload.middleware');
const { validateUpdateProfile } = require('./user.validation');

const router = express.Router();

// Protect all user routes
router.use(protect);

router.get('/', userController.getAllUsers);
router.patch('/profile', handleSingleUpload('avatar'), validate(validateUpdateProfile), userController.updateProfile);
router.get('/:id', userController.getUserById);
router.delete('/:id', restrictTo('admin'), userController.deleteUser);

module.exports = router;
