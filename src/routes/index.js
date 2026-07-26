const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const projectRoutes = require('../modules/projects/project.routes');
const boardRoutes = require('../modules/boards/board.routes');
const listRoutes = require('../modules/lists/list.routes');
const taskRoutes = require('../modules/tasks/task.routes');
const commentRoutes = require('../modules/comments/comment.routes');
const attachmentRoutes = require('../modules/attachments/attachment.routes');
const notificationRoutes = require('../modules/notifications/notification.routes');

const router = express.Router();

// Health Check Route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running smoothly 🚀',
    timestamp: new Date().toISOString()
  });
});

// Module routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/boards', boardRoutes);
router.use('/lists', listRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/attachments', attachmentRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
