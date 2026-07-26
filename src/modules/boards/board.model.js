const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
      maxlength: [100, 'Board title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    position: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
