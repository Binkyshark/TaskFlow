const mongoose = require('mongoose');

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'List title is required'],
      trim: true,
      minlength: [3, 'List title must be at least 3 characters'],
      maxlength: [100, 'List title cannot exceed 100 characters']
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board ID is required']
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
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

listSchema.index({ board: 1 });

listSchema.index({
  board: 1,
  position: 1
});

listSchema.index(
  {
    board: 1,
    title: 1
  },
  {
    unique: true
  }
);

const List = mongoose.model('List', listSchema);

module.exports = List;