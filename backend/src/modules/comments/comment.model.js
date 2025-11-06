/**
 * Comment Model
 * 
 * Defines comment schema with moderation workflow.
 * 
 * @module modules/comments/model
 */

import mongoose from 'mongoose';
import { COMMENT_STATUS } from '../../utils/constants.js';

const { Schema, model } = mongoose;

/**
 * Comment Schema
 */
const commentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Comment must not be empty'],
      maxlength: [1000, 'Comment must not exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(COMMENT_STATUS),
        message: 'Invalid comment status',
      },
      default: COMMENT_STATUS.PENDING,
      index: true,
    },
    rejectionReason: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for performance
commentSchema.index({ post: 1, status: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

/**
 * Static method to find approved comments
 */
commentSchema.statics.findApproved = function (postId) {
  return this.find({ post: postId, status: COMMENT_STATUS.APPROVED })
    .populate('author', 'name avatar role')
    .sort({ createdAt: -1 });
};

/**
 * Instance method to check if comment is editable by user
 */
commentSchema.methods.isEditableBy = function (userId, userRole) {
  if (userRole === 'admin') return true;
  if (this.author.toString() === userId.toString()) return true;
  return false;
};

const Comment = model('Comment', commentSchema);

export default Comment;
