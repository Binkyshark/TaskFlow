const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true
    },

    fileName: {
      type: String,
      required: [true, 'Stored file name is required'],
      trim: true
    },

    url: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true
    },

    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true
    },

    extension: {
      type: String,
      required: [true, 'File extension is required'],
      trim: true
    },

    size: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative']
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
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },

    toObject: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

// Get attachments for a task
attachmentSchema.index({
  task: 1,
  createdAt: -1
});

// Get attachments uploaded by a user
attachmentSchema.index({
  uploadedBy: 1
});

// Filter by mime type
attachmentSchema.index({
  mimeType: 1
});

// Soft delete support
attachmentSchema.index({
  isDeleted: 1
});

const Attachment = mongoose.model(
  'Attachment',
  attachmentSchema
);

module.exports = {
  Attachment
};
