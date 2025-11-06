/**
 * Category Model
 * 
 * Defines category schema for organizing posts.
 * 
 * @module modules/categories/model
 */

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Category Schema
 */
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true, // This creates index automatically
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [100, 'Category name must not exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true, // This creates index automatically
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description must not exceed 300 characters'],
      default: '',
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

// REMOVED: categorySchema.index({ name: 1 }); - Already created by unique: true
// REMOVED: categorySchema.index({ slug: 1 }); - Already created by unique: true

/**
 * Pre-save hook to generate slug
 */
categorySchema.pre('save', async function (next) {
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
categorySchema.statics.incrementPostCount = function (categoryId) {
  return this.findByIdAndUpdate(categoryId, { $inc: { postCount: 1 } });
};

/**
 * Static method to decrement post count
 */
categorySchema.statics.decrementPostCount = function (categoryId) {
  return this.findByIdAndUpdate(categoryId, { $inc: { postCount: -1 } });
};

const Category = model('Category', categorySchema);

export default Category;
