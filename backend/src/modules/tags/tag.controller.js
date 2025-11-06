/**
 * Tag Controller
 * 
 * Handles HTTP requests for tag endpoints.
 * 
 * @module modules/tags/controller
 */

import * as tagService from './tag.service.js';
import { sendSuccess } from '../../utils/response.js';

/**
 * Create tag
 * POST /api/tags
 */
export async function createTag(req, res, next) {
  try {
    const tag = await tagService.createTag(req.body);
    sendSuccess(res, tag, 'Tag created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all tags
 * GET /api/tags
 */
export async function getTags(req, res, next) {
  try {
    const { includeEmpty, limit } = req.query;
    const tags = await tagService.getAllTags({ 
      includeEmpty: includeEmpty !== 'false',
      limit: parseInt(limit) || 0,
    });
    sendSuccess(res, tags, 'Tags retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get popular tags
 * GET /api/tags/popular
 */
export async function getPopularTags(req, res, next) {
  try {
    const { limit = 10 } = req.query;
    const tags = await tagService.getPopularTags(parseInt(limit));
    sendSuccess(res, tags, 'Popular tags retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get tag by ID
 * GET /api/tags/:id
 */
export async function getTag(req, res, next) {
  try {
    const tag = await tagService.getTagById(req.params.id);
    sendSuccess(res, tag, 'Tag retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update tag
 * PATCH /api/tags/:id
 */
export async function updateTag(req, res, next) {
  try {
    const tag = await tagService.updateTag(req.params.id, req.body);
    sendSuccess(res, tag, 'Tag updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete tag
 * DELETE /api/tags/:id
 */
export async function deleteTag(req, res, next) {
  try {
    await tagService.deleteTag(req.params.id);
    sendSuccess(res, null, 'Tag deleted successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  createTag,
  getTags,
  getPopularTags,
  getTag,
  updateTag,
  deleteTag,
};
