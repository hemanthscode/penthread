/**
 * Category Service
 * 
 * Handles category business logic.
 * 
 * @module modules/categories/service
 */

import Category from './category.model.js';
import Post from '../posts/post.model.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

/**
 * Creates a new category
 */
export async function createCategory(data) {
  const { name, description } = data;

  // Check if category already exists
  const existing = await Category.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') } 
  });

  if (existing) {
    throw AppError.conflict('Category already exists');
  }

  const category = new Category({ name, description });
  await category.save();

  logger.info(`Category created: ${category.name}`);

  return category;
}

/**
 * Gets all categories with post counts
 */
export async function getAllCategories(options = {}) {
  const { includeEmpty = true } = options;

  const filter = includeEmpty ? {} : { postCount: { $gt: 0 } };

  const categories = await Category.find(filter).sort({ name: 1 });

  return categories;
}

/**
 * Gets a single category by ID
 */
export async function getCategoryById(categoryId) {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw AppError.notFound('Category not found');
  }

  return category;
}

/**
 * Updates a category
 */
export async function updateCategory(categoryId, updateData) {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw AppError.notFound('Category not found');
  }

  // Check for duplicate name
  if (updateData.name) {
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
      _id: { $ne: categoryId },
    });

    if (existing) {
      throw AppError.conflict('Category name already exists');
    }
  }

  Object.assign(category, updateData);
  await category.save();

  logger.info(`Category updated: ${category.name}`);

  return category;
}

/**
 * Deletes a category
 */
export async function deleteCategory(categoryId) {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw AppError.notFound('Category not found');
  }

  // Check if category is used in posts
  const postCount = await Post.countDocuments({ categories: categoryId });

  if (postCount > 0) {
    throw AppError.badRequest(
      `Cannot delete category. It is used in ${postCount} post(s). Please remove it from posts first.`
    );
  }

  await category.deleteOne();

  logger.info(`Category deleted: ${category.name}`);
}

/**
 * Recalculates post count for a category
 */
export async function recalculatePostCount(categoryId) {
  const count = await Post.countDocuments({ 
    categories: categoryId,
    status: 'published',
  });

  await Category.findByIdAndUpdate(categoryId, { postCount: count });

  logger.info(`Recalculated post count for category ${categoryId}: ${count}`);

  return count;
}

export default {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  recalculatePostCount,
};
