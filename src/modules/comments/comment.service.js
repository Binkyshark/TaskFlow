const Comment = require('./comment.model');
const taskService = require('../tasks/task.service');

class CommentService {
  /**
   * Create comment on a task
   */
  async createComment(userId, data) {
    const { content, taskId } = data;

    // Verify task exists and user has authorization to view it
    await taskService.getTaskById(taskId, userId);

    const comment = await Comment.create({
      content,
      task: taskId,
      author: userId
    });

    return comment.populate('author', 'name email avatar');
  }

  /**
   * Get all comments for a task
   */
  async getCommentsByTask(taskId, userId) {
    await taskService.getTaskById(taskId, userId);

    return Comment.find({ task: taskId })
      .populate('author', 'name email avatar')
      .sort({ createdAt: 1 });
  }

  /**
   * Update comment content
   */
  async updateComment(commentId, userId, content) {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      const error = new Error('Comment not found');
      error.statusCode = 404;
      throw error;
    }

    if (comment.author.toString() !== userId.toString()) {
      const error = new Error('Only the author can edit this comment');
      error.statusCode = 403;
      throw error;
    }

    comment.content = content;
    await comment.save();

    return comment.populate('author', 'name email avatar');
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId, userId) {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      const error = new Error('Comment not found');
      error.statusCode = 404;
      throw error;
    }

    if (comment.author.toString() !== userId.toString()) {
      const error = new Error('Only the author can delete this comment');
      error.statusCode = 403;
      throw error;
    }

    await Comment.findByIdAndDelete(commentId);
    return { message: 'Comment deleted successfully' };
  }
}

module.exports = new CommentService();
