const mongoose = require('mongoose');

const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters'],
      maxlength: [200, 'Task title cannot exceed 200 characters']
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },

    // Parent List
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
      required: [true, 'List ID is required']
    },

    // Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Multiple assignees
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: 'medium'
    },

    labels: [
      {
        type: String,
        trim: true,
        maxlength: 50
      }
    ],

    dueDate: {
      type: Date,
      default: null
    },

    position: {
      type: Number,
      default: 0,
      min: [0, 'Position cannot be negative']
    },

    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },

    toObject: {
      virtuals: true,
      transform(_doc, ret) {
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

taskSchema.index({ list: 1 });

taskSchema.index({
  list: 1,
  position: 1
});

taskSchema.index({
  dueDate: 1
});

taskSchema.index({
  assignees: 1
});

taskSchema.index({
  priority: 1
});

taskSchema.index({
  createdBy: 1
});

const Task = mongoose.model('Task', taskSchema);

module.exports = {
  Task,
  TASK_PRIORITIES
};
