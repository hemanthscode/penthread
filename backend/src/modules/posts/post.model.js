/**
 * Post Model
 * 
 * Defines post schema with status workflow, relationships,
 * and interaction counters.
 * 
 * @module modules/posts/model
 */

import mongoose from 'mongoose';
import { POST_STATUS } from '../../utils/constants.js';

const { Schema, model } = mongoose;

/**
 * Post Schema
 */
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title must not exceed 200 characters'],
      index: 'text',
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [50, 'Content must be at least 50 characters'],
      index: 'text',
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt must not exceed 500 characters'],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(POST_STATUS),
        message: 'Invalid post status',
      },
      default: POST_STATUS.DRAFT,
      index: true,
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    featuredImage: {
      type: String,
      default: '',
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    favoritesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    publishedAt: {
      type: Date,
      index: true,
    },
    rejectionReason: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for performance
postSchema.index({ author: 1, status: 1, createdAt: -1 });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ categories: 1, status: 1 });
postSchema.index({ tags: 1, status: 1 });
postSchema.index({ title: 'text', content: 'text' });

/**
 * Pre-save hook to generate slug and excerpt
 */
postSchema.pre('save', async function (next) {
  // Generate slug from title if not provided
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Ensure uniqueness
    const existingPost = await this.constructor.findOne({ slug: this.slug });
    if (existingPost && !existingPost._id.equals(this._id)) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }

  // Generate excerpt from content if not provided
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .substring(0, 200)
      .trim() + '...';
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === POST_STATUS.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

/**
 * Virtual for reading time (based on 200 words per minute)
 */
postSchema.virtual('readingTime').get(function () {
  // Safety check for missing or invalid content
  if (!this.content || typeof this.content !== 'string') {
    return 0;
  }
  
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
});

/**
 * Virtual for post URL
 */
postSchema.virtual('postUrl').get(function () {
  return `/api/posts/${this._id}`;
});

/**
 * Static method to find published posts
 */
postSchema.statics.findPublished = function (filter = {}) {
  return this.find({ ...filter, status: POST_STATUS.PUBLISHED });
};

/**
 * Instance method to check if post is editable by user
 */
postSchema.methods.isEditableBy = function (userId, userRole) {
  if (userRole === 'admin') return true;
  if (userRole === 'author' && this.author.toString() === userId.toString()) {
    return true;
  }
  return false;
};

/**
 * Instance method to check if post can be published
 */
postSchema.methods.canPublish = function () {
  return [POST_STATUS.DRAFT, POST_STATUS.APPROVED, POST_STATUS.UNPUBLISHED].includes(this.status);
};

const Post = model('Post', postSchema);

export default Post;
