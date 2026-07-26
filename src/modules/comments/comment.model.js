const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment content cannot exceed 1000 characters']
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task ID is required']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
