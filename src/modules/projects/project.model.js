const mongoose = require('mongoose');

const PROJECT_MEMBER_ROLES = Object.freeze({
  ADMIN: 'admin',
  MEMBER: 'member'
});

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: Object.values(PROJECT_MEMBER_ROLES),
      default: PROJECT_MEMBER_ROLES.MEMBER
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [3, 'Project name must be at least 3 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters']
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    members: [memberSchema],

    isArchived: {
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

// Get all projects for a specific owner
projectSchema.index({ owner: 1 });

// Prevent the same owner from creating two projects with the same name
projectSchema.index(
  {
    owner: 1,
    name: 1
  },
  {
    unique: true
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = {
  Project,
  PROJECT_MEMBER_ROLES
};
