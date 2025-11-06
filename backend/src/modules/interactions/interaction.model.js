/**
 * Interaction Model
 * 
 * Tracks user interactions with posts (likes, favorites).
 * Uses compound unique index for one interaction per user-post pair.
 * 
 * @module modules/interactions/model
 */

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Interaction Schema
 */
const interactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
      index: true,
    },
    liked: {
      type: Boolean,
      default: false,
    },
    favorited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one interaction per user-post pair
interactionSchema.index({ user: 1, post: 1 }, { unique: true });

// Indexes for queries
interactionSchema.index({ user: 1, liked: 1 });
interactionSchema.index({ user: 1, favorited: 1 });
interactionSchema.index({ post: 1, liked: 1 });
interactionSchema.index({ post: 1, favorited: 1 });

/**
 * Static method to get user's liked posts
 */
interactionSchema.statics.findLikedByUser = function (userId) {
  return this.find({ user: userId, liked: true })
    .populate('post')
    .sort({ updatedAt: -1 });
};

/**
 * Static method to get user's favorited posts
 */
interactionSchema.statics.findFavoritedByUser = function (userId) {
  return this.find({ user: userId, favorited: true })
    .populate('post')
    .sort({ updatedAt: -1 });
};

const Interaction = model('Interaction', interactionSchema);

export default Interaction;
