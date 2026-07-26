const mongoose = require('mongoose');

// User Role Constants - Central Source of Truth
const USER_ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin'
});

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false
    },
    avatar: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER
    },
    isActive: {
      type: Boolean,
      default: true
    }
    // Future Expansion Note:
    // Soft Delete capability can be added when required by adding:
    // deletedAt: { type: Date, default: null }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

// Explicit Database B-Tree Unique Index on Email
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  USER_ROLES
};
