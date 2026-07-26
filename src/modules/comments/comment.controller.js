const commentService = require('./comment.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class CommentController {
  createComment = catchAsync(async (req, res) => {
    const comment = await commentService.createComment(req.user.id, req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Comment added successfully',
      data: { comment }
    });
  });

  getCommentsByTask = catchAsync(async (req, res) => {
    const { taskId } = req.query;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'taskId query parameter is required'
      });
    }
    const comments = await commentService.getCommentsByTask(taskId, req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Comments retrieved successfully',
      data: { comments }
    });
  });

  updateComment = catchAsync(async (req, res) => {
    const comment = await commentService.updateComment(req.params.id, req.user.id, req.body.content);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Comment updated successfully',
      data: { comment }
    });
  });

  deleteComment = catchAsync(async (req, res) => {
    const result = await commentService.deleteComment(req.params.id, req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: result.message
    });
  });
}

module.exports = new CommentController();
