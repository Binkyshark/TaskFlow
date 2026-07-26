const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required']
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['task_assigned', 'status_changed', 'comment_added', 'mention', 'general'],
      default: 'general'
    },
    read: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
