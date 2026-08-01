const mongoose = require('mongoose');

const NOTIFICATION_TYPES = Object.freeze({
  GENERAL: 'general',

  PROJECT_INVITATION: 'project_invitation',

  BOARD_CREATED: 'board_created',

  TASK_ASSIGNED: 'task_assigned',

  TASK_UPDATED: 'task_updated',

  TASK_COMPLETED: 'task_completed',

  COMMENT_ADDED: 'comment_added',

  ATTACHMENT_UPLOADED: 'attachment_uploaded'
});

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      default: NOTIFICATION_TYPES.GENERAL
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board'
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },

    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },

    attachment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attachment'
    },

    link: {
      type: String,
      default: ''
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    isRead: {
      type: Boolean,
      default: false
    },

    readAt: {
      type: Date,
      default: null
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

notificationSchema.index({
  recipient: 1,
  createdAt: -1
});

notificationSchema.index({
  recipient: 1,
  isRead: 1
});

notificationSchema.index({
  type: 1
});

notificationSchema.index({
  task: 1
});

notificationSchema.index({
  project: 1
});

const Notification = mongoose.model(
  'Notification',
  notificationSchema
);

module.exports = {
  Notification,
  NOTIFICATION_TYPES
};
