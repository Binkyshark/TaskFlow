const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
      minlength: [3, 'Board title must be at least 3 characters'],
      maxlength: [100, 'Board title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
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
      default: 0,
      min: 0
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
// Get all boards of a project
boardSchema.index({ project: 1 });

// Sort boards inside a project
boardSchema.index({
  project: 1,
  position: 1
});

// Prevent duplicate board titles in the same project
boardSchema.index(
  {
    project: 1,
    title: 1
  },
  {
    unique: true
  }
);
const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
