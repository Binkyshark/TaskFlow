const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const { Attachment } = require('./attachment.model');
const taskService = require('../tasks/task.service');
const activityService = require('../activities/activity.service');

const DELETED_FILE_NAME = 'Deleted Attachment';

const ATTACHMENT_POPULATE = [
  {
    path: 'uploadedBy',
    select: 'name email avatar'
  },
  {
    path: 'task',
    select: 'title'
  }
];

class AttachmentService {
  /**
   * Upload Attachment
   */
  async uploadAttachment(taskId, userId, file) {
    if (!file) {
      const error = new Error('No file uploaded');
      error.statusCode = 400;
      throw error;
    }

    // Verify user can access task
    const task = await taskService.getTaskById(taskId, userId);

    const attachment = await Attachment.create({
      originalName: file.originalname,
      fileName: file.filename,
      url: file.path.replace(/\\/g, '/'),
      mimeType: file.mimetype,
      extension: path.extname(file.originalname),
      size: file.size,
      task: taskId,
      uploadedBy: userId
    });

    const populatedAttachment = await attachment.populate(ATTACHMENT_POPULATE);

    await activityService.logAttachmentUploaded(
      userId,
      populatedAttachment,
      task
    );

    return populatedAttachment;
  }

  /**
   * Get Attachments For Task
   */
  async getAttachmentsByTask(taskId, userId) {
    await taskService.getTaskById(taskId, userId);

    return Attachment.find({
      task: taskId,
      isDeleted: false
    })
      .populate(ATTACHMENT_POPULATE)
      .sort({
        createdAt: -1
      });
  }

  /**
   * Get Attachment By Id
   */
  async getAttachmentById(attachmentId, userId) {
    if (!mongoose.Types.ObjectId.isValid(attachmentId)) {
      const error = new Error('Invalid attachment ID');
      error.statusCode = 400;
      throw error;
    }

    const attachment = await Attachment.findById(
      attachmentId
    ).populate(ATTACHMENT_POPULATE);

    if (!attachment) {
      const error = new Error('Attachment not found');
      error.statusCode = 404;
      throw error;
    }

    await taskService.getTaskById(
      attachment.task._id,
      userId
    );

    return attachment;
  }

  /**
   * Delete Attachment (Soft Delete)
   */
  async deleteAttachment(attachmentId, userId) {
    const attachment = await this.getAttachmentById(
      attachmentId,
      userId
    );

    if (
      attachment.uploadedBy._id.toString() !==
      userId.toString()
    ) {
      const error = new Error(
        'Only the uploader can delete this attachment'
      );
      error.statusCode = 403;
      throw error;
    }

    // Delete physical file
    if (
      attachment.url &&
      fs.existsSync(attachment.url)
    ) {
      fs.unlinkSync(attachment.url);
    }

    // Soft delete
    attachment.isDeleted = true;

    await attachment.save();

    return {
      message: 'Attachment deleted successfully'
    };
  }
}

module.exports = new AttachmentService();
