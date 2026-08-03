const mongoose = require('mongoose');

const ACTIVITY_ACTIONS = Object.freeze({
  // Projects
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_ARCHIVED: 'project_archived',
  PROJECT_DELETED: 'project_deleted',

  // Boards
  BOARD_CREATED: 'board_created',
  BOARD_UPDATED: 'board_updated',
  BOARD_DELETED: 'board_deleted',

  // Lists
  LIST_CREATED: 'list_created',
  LIST_UPDATED: 'list_updated',
  LIST_DELETED: 'list_deleted',

  // Tasks
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_MOVED: 'task_moved',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  TASK_DELETED: 'task_deleted',

  // Comments
  COMMENT_ADDED: 'comment_added',
  COMMENT_UPDATED: 'comment_updated',
  COMMENT_DELETED: 'comment_deleted',

  // Attachments
  ATTACHMENT_UPLOADED: 'attachment_uploaded',
  ATTACHMENT_DELETED: 'attachment_deleted'
});

const ENTITY_TYPES = Object.freeze({
  PROJECT: 'Project',
  BOARD: 'Board',
  LIST: 'List',
  TASK: 'Task',
  COMMENT: 'Comment',
  ATTACHMENT: 'Attachment'
});

const ACTIVITY_SEVERITY = Object.freeze({
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical'
});

const activitySchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Actor
    |--------------------------------------------------------------------------
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    /*
    |--------------------------------------------------------------------------
    | Activity
    |--------------------------------------------------------------------------
    */

    action: {
      type: String,
      enum: Object.values(ACTIVITY_ACTIONS),
      required: true
    },

    entityType: {
      type: String,
      enum: Object.values(ENTITY_TYPES),
      required: true
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    /*
    |--------------------------------------------------------------------------
    | Context
    |--------------------------------------------------------------------------
    */

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board'
    },

    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List'
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

    /*
    |--------------------------------------------------------------------------
    | Details
    |--------------------------------------------------------------------------
    */

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    severity: {
      type: String,
      enum: Object.values(ACTIVITY_SEVERITY),
      default: ACTIVITY_SEVERITY.INFO
    }
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;

        return ret;
      }
    },

    toObject: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;

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

activitySchema.index({
  project: 1,
  createdAt: -1
});

activitySchema.index({
  board: 1,
  createdAt: -1
});

activitySchema.index({
  list: 1,
  createdAt: -1
});

activitySchema.index({
  task: 1,
  createdAt: -1
});

activitySchema.index({
  comment: 1,
  createdAt: -1
});

activitySchema.index({
  attachment: 1,
  createdAt: -1
});

activitySchema.index({
  user: 1,
  createdAt: -1
});

activitySchema.index({
  action: 1
});

activitySchema.index({
  entityType: 1
});

activitySchema.index({
  severity: 1
});

const Activity = mongoose.model(
  'Activity',
  activitySchema
);

module.exports = {
  Activity,
  ACTIVITY_ACTIONS,
  ENTITY_TYPES,
  ACTIVITY_SEVERITY
};