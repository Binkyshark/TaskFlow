const mongoose = require('mongoose');
const { Comment } = require('./comment.model');
const taskService = require('../tasks/task.service');

const COMMENT_POPULATE = [
  {
    path: 'author',
    select: 'name email avatar'
  },
  {
    path: 'task',
    select: 'title'
  }
];

class CommentService {
  /**
   * Create Comment
   */
  async createComment(taskId, userId, data) {
    const { content } = data;

    // Verify task exists and user has access
    await taskService.getTaskById(taskId, userId);

    const comment = await Comment.create({
      content,
      task: taskId,
      author: userId
    });

    return comment.populate(COMMENT_POPULATE);
  }

  /**
   * Get All Comments For Task
   */
  async getCommentsByTask(taskId, userId) {
    await taskService.getTaskById(taskId, userId);

    return Comment.find({
      task: taskId,
      isDeleted: false
    })
      .populate(COMMENT_POPULATE)
      .sort({
        createdAt: 1
      });
  }

  /**
   * Get Comment By Id
   */
  async getCommentById(commentId, userId) {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      const error = new Error('Invalid comment ID');
      error.statusCode = 400;
      throw error;
    }

    const comment = await Comment.findById(commentId)
      .populate(COMMENT_POPULATE);

    if (!comment) {
      const error = new Error('Comment not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify user has access to the task
    await taskService.getTaskById(
      comment.task._id,
      userId
    );

    return comment;
  }

  /**
   * Update Comment
   */
  async updateComment(commentId, userId, updateData) {
    const comment = await this.getCommentById(
      commentId,
      userId
    );

    if (
      comment.author._id.toString() !==
      userId.toString()
    ) {
      const error = new Error(
        'Only the author can edit this comment'
      );

      error.statusCode = 403;

      throw error;
    }

    if (updateData.content !== undefined) {
      comment.content = updateData.content;
      comment.isEdited = true;
    }

    await comment.save();

    return comment.populate(COMMENT_POPULATE);
  }

  /**
   * Delete Comment (Soft Delete)
   */
  async deleteComment(commentId, userId) {
    const comment = await this.getCommentById(
      commentId,
      userId
    );

    if (
      comment.author._id.toString() !==
      userId.toString()
    ) {
      const error = new Error(
        'Only the author can delete this comment'
      );

      error.statusCode = 403;

      throw error;
    }

    comment.content = 'This comment was deleted';
    comment.isDeleted = true;

    await comment.save();

    return {
      message: 'Comment deleted successfully'
    };
  }
}

module.exports = new CommentService();