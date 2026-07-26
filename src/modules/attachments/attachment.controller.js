const attachmentService = require('./attachment.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class AttachmentController {
  uploadAttachment = catchAsync(async (req, res) => {
    const { taskId } = req.body;
    const attachment = await attachmentService.uploadAttachment(req.user.id, taskId, req.file);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Attachment uploaded successfully',
      data: { attachment }
    });
  });

  getAttachmentsByTask = catchAsync(async (req, res) => {
    const { taskId } = req.query;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'taskId query parameter is required'
      });
    }
    const attachments = await attachmentService.getAttachmentsByTask(taskId, req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Attachments retrieved successfully',
      data: { attachments }
    });
  });

  deleteAttachment = catchAsync(async (req, res) => {
    const result = await attachmentService.deleteAttachment(req.params.id, req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: result.message
    });
  });
}

module.exports = new AttachmentController();
