const attachmentService = require('./attachment.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class AttachmentController {
  /**
   * Upload Attachment
   */
  uploadAttachment = catchAsync(async (req, res) => {
    const attachment = await attachmentService.uploadAttachment(
      req.params.taskId,
      req.user.id,
      req.file
    );

    return sendResponse(res, {
      statusCode: 201,
      message: 'Attachment uploaded successfully',
      data: {
        attachment
      }
    });
  });

  /**
   * Get All Attachments For Task
   */
  getAttachmentsByTask = catchAsync(async (req, res) => {
    const attachments = await attachmentService.getAttachmentsByTask(
      req.params.taskId,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Attachments retrieved successfully',
      data: {
        attachments
      }
    });
  });

  /**
   * Get Attachment By Id
   */
  getAttachmentById = catchAsync(async (req, res) => {
    const attachment = await attachmentService.getAttachmentById(
      req.params.id,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Attachment retrieved successfully',
      data: {
        attachment
      }
    });
  });

  /**
   * Delete Attachment
   */
  deleteAttachment = catchAsync(async (req, res) => {
    const result = await attachmentService.deleteAttachment(
      req.params.id,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: result.message
    });
  });
}

module.exports = new AttachmentController();
