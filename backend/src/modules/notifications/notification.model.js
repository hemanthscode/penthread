/**
 * Notification Model
 * 
 * Defines notification schema for user notifications.
 * 
 * @module modules/notifications/model
 */

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Notification Schema
 */
const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title must not exceed 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message must not exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    link: {
      type: String,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for performance
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, createdAt: -1 });

/**
 * Static method to get unread count for a user
 */
notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

/**
 * Static method to mark all as read for a user
 */
notificationSchema.statics.markAllReadForUser = function (userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );
};

const Notification = model('Notification', notificationSchema);

export default Notification;
