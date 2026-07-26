const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Task title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
      required: [true, 'List ID is required']
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board ID is required']
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required']
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    dueDate: {
      type: Date
    },
    position: {
      type: Number,
      default: 0
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
