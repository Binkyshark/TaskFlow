const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task ID is required']
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;
