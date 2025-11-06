/**
 * Category Controller
 * 
 * Handles HTTP requests for category endpoints.
 * 
 * @module modules/categories/controller
 */

import * as categoryService from './category.service.js';
import { sendSuccess } from '../../utils/response.js';

/**
 * Create category
 * POST /api/categories
 */
export async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body);
    sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all categories
 * GET /api/categories
 */
export async function getCategories(req, res, next) {
  try {
    const { includeEmpty } = req.query;
    const categories = await categoryService.getAllCategories({ 
      includeEmpty: includeEmpty !== 'false' 
    });
    sendSuccess(res, categories, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get category by ID
 * GET /api/categories/:id
 */
export async function getCategory(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    sendSuccess(res, category, 'Category retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update category
 * PATCH /api/categories/:id
 */
export async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    sendSuccess(res, category, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete category
 * DELETE /api/categories/:id
 */
export async function deleteCategory(req, res, next) {
  try {
    await categoryService.deleteCategory(req.params.id);
    sendSuccess(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
