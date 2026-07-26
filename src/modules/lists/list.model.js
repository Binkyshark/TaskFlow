const mongoose = require('mongoose');

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'List title is required'],
      trim: true,
      maxlength: [100, 'List title cannot exceed 100 characters']
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board ID is required']
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

const List = mongoose.model('List', listSchema);

module.exports = List;
