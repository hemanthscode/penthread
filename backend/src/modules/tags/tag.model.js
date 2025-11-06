/**
 * Tag Model
 * 
 * Defines tag schema for post tagging.
 * 
 * @module modules/tags/model
 */

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Tag Schema
 */
const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true, // This creates index automatically
      trim: true,
      lowercase: true,
      minlength: [2, 'Tag name must be at least 2 characters'],
      maxlength: [50, 'Tag name must not exceed 50 characters'],
    },
    slug: {
      type: String,
      unique: true, // This creates index automatically
      lowercase: true,
      trim: true,
    },
    postCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// REMOVED: tagSchema.index({ name: 1 }); - Already created by unique: true
// REMOVED: tagSchema.index({ slug: 1 }); - Already created by unique: true

/**
 * Pre-save hook to generate slug
 */
tagSchema.pre('save', async function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const existing = await this.constructor.findOne({ slug: this.slug });
    if (existing && !existing._id.equals(this._id)) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }
  next();
});

/**
 * Static method to increment post count
 */
tagSchema.statics.incrementPostCount = function (tagId) {
  return this.findByIdAndUpdate(tagId, { $inc: { postCount: 1 } });
};

/**
 * Static method to decrement post count
 */
tagSchema.statics.decrementPostCount = function (tagId) {
  return this.findByIdAndUpdate(tagId, { $inc: { postCount: -1 } });
};

const Tag = model('Tag', tagSchema);

export default Tag;
