const Attachment = require('./attachment.model');
const taskService = require('../tasks/task.service');
const fs = require('fs');

class AttachmentService {
  /**
   * Upload attachment for a task
   */
  async uploadAttachment(userId, taskId, file) {
    if (!file) {
      const error = new Error('No file uploaded');
      error.statusCode = 400;
      throw error;
    }

    // Verify task exists and user has authorization
    await taskService.getTaskById(taskId, userId);

    const attachment = await Attachment.create({
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      task: taskId,
      uploadedBy: userId
    });

    return attachment.populate('uploadedBy', 'name email avatar');
  }

  /**
   * Get all attachments for a task
   */
  async getAttachmentsByTask(taskId, userId) {
    await taskService.getTaskById(taskId, userId);

    return Attachment.find({ task: taskId })
      .populate('uploadedBy', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(attachmentId, userId) {
    const attachment = await Attachment.findById(attachmentId);

    if (!attachment) {
      const error = new Error('Attachment not found');
      error.statusCode = 404;
      throw error;
    }

    // Check ownership or task access
    if (attachment.uploadedBy.toString() !== userId.toString()) {
      const error = new Error('Only the uploader can delete this attachment');
      error.statusCode = 403;
      throw error;
    }

    // Remove file from disk
    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }

    await Attachment.findByIdAndDelete(attachmentId);
    return { message: 'Attachment deleted successfully' };
  }
}

module.exports = new AttachmentService();
