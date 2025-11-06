/**
 * Activity Model
 * 
 * Tracks user activities across the platform.
 * 
 * @module modules/activity/model
 */

import mongoose from 'mongoose';
import { ACTIVITY_TYPES } from '../../utils/constants.js';

const { Schema, model } = mongoose;

/**
 * Activity Schema
 */
const activitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: Object.values(ACTIVITY_TYPES),
    },
    details: {
      type: String,
      trim: true,
      maxlength: [500, 'Details must not exceed 500 characters'],
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

// Indexes for performance
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });

/**
 * Static method to get user activity timeline
 */
activitySchema.statics.getUserTimeline = function (userId, limit = 20) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name avatar');
};

const Activity = model('Activity', activitySchema);

export default Activity;
