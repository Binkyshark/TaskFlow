const commentService = require('./comment.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class CommentController {
  /**
   * Create Comment
   */
  createComment = catchAsync(async (req, res) => {
    const comment = await commentService.createComment(
      req.params.taskId,
      req.user.id,
      req.body
    );

    return sendResponse(res, {
      statusCode: 201,
      message: 'Comment added successfully',
      data: { comment }
    });
  });

  /**
   * Get All Comments For Task
   */
  getCommentsByTask = catchAsync(async (req, res) => {
    const comments = await commentService.getCommentsByTask(
      req.params.taskId,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Comments retrieved successfully',
      data: { comments }
    });
  });

  /**
   * Get Single Comment
   */
  getCommentById = catchAsync(async (req, res) => {
    const comment = await commentService.getCommentById(
      req.params.id,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Comment retrieved successfully',
      data: { comment }
    });
  });

  /**
   * Update Comment
   */
  updateComment = catchAsync(async (req, res) => {
    const comment = await commentService.updateComment(
      req.params.id,
      req.user.id,
      req.body
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Comment updated successfully',
      data: { comment }
    });
  });

  /**
   * Delete Comment
   */
  deleteComment = catchAsync(async (req, res) => {
    const result = await commentService.deleteComment(
      req.params.id,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: result.message
    });
  });
}

module.exports = new CommentController();