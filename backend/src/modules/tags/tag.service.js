/**
 * Tag Service
 * 
 * Handles tag business logic.
 * 
 * @module modules/tags/service
 */

import Tag from './tag.model.js';
import Post from '../posts/post.model.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

/**
 * Creates a new tag
 */
export async function createTag(data) {
  const { name } = data;

  // Check if tag already exists (case-insensitive)
  const existing = await Tag.findOne({ 
    name: name.toLowerCase().trim() 
  });

  if (existing) {
    throw AppError.conflict('Tag already exists');
  }

  const tag = new Tag({ name: name.toLowerCase().trim() });
  await tag.save();

  logger.info(`Tag created: ${tag.name}`);

  return tag;
}

/**
 * Gets all tags with post counts
 */
export async function getAllTags(options = {}) {
  const { includeEmpty = true, limit = 0 } = options;

  const filter = includeEmpty ? {} : { postCount: { $gt: 0 } };

  let query = Tag.find(filter).sort({ postCount: -1, name: 1 });

  if (limit > 0) {
    query = query.limit(limit);
  }

  const tags = await query;

  return tags;
}

/**
 * Gets a single tag by ID
 */
export async function getTagById(tagId) {
  const tag = await Tag.findById(tagId);

  if (!tag) {
    throw AppError.notFound('Tag not found');
  }

  return tag;
}

/**
 * Updates a tag
 */
export async function updateTag(tagId, updateData) {
  const tag = await Tag.findById(tagId);

  if (!tag) {
    throw AppError.notFound('Tag not found');
  }

  // Check for duplicate name
  if (updateData.name) {
    const normalizedName = updateData.name.toLowerCase().trim();
    const existing = await Tag.findOne({
      name: normalizedName,
      _id: { $ne: tagId },
    });

    if (existing) {
      throw AppError.conflict('Tag name already exists');
    }

    updateData.name = normalizedName;
  }

  Object.assign(tag, updateData);
  await tag.save();

  logger.info(`Tag updated: ${tag.name}`);

  return tag;
}

/**
 * Deletes a tag
 */
export async function deleteTag(tagId) {
  const tag = await Tag.findById(tagId);

  if (!tag) {
    throw AppError.notFound('Tag not found');
  }

  // Check if tag is used in posts
  const postCount = await Post.countDocuments({ tags: tagId });

  if (postCount > 0) {
    throw AppError.badRequest(
      `Cannot delete tag. It is used in ${postCount} post(s). Please remove it from posts first.`
    );
  }

  await tag.deleteOne();

  logger.info(`Tag deleted: ${tag.name}`);
}

/**
 * Recalculates post count for a tag
 */
export async function recalculatePostCount(tagId) {
  const count = await Post.countDocuments({ 
    tags: tagId,
    status: 'published',
  });

  await Tag.findByIdAndUpdate(tagId, { postCount: count });

  logger.info(`Recalculated post count for tag ${tagId}: ${count}`);

  return count;
}

/**
 * Gets popular tags
 */
export async function getPopularTags(limit = 10) {
  return Tag.find({ postCount: { $gt: 0 } })
    .sort({ postCount: -1 })
    .limit(limit);
}

export default {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
  recalculatePostCount,
  getPopularTags,
};
