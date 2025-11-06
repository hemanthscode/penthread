/**
 * Post Validators
 * 
 * Joi schemas for validating post requests.
 * 
 * @module modules/posts/validators
 */

import Joi from 'joi';
import { POST_STATUS } from '../../utils/constants.js';

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

/**
 * Create post validation schema
 */
export const createPostSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required',
    }),
  content: Joi.string()
    .min(50)
    .required()
    .messages({
      'string.min': 'Content must be at least 50 characters',
      'any.required': 'Content is required',
    }),
  excerpt: Joi.string().max(500).allow(''),
  categories: Joi.array().items(objectId).max(5),
  tags: Joi.array().items(objectId).max(10),
  featuredImage: Joi.string().allow(''),
});

/**
 * Update post validation schema
 */
export const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200),
  content: Joi.string().min(50),
  excerpt: Joi.string().max(500).allow(''),
  status: Joi.string().valid(...Object.values(POST_STATUS)),
  categories: Joi.array().items(objectId).max(5),
  tags: Joi.array().items(objectId).max(10),
  featuredImage: Joi.string().uri().allow(''),
}).min(1);

/**
 * Reject post validation schema
 */
export const rejectPostSchema = Joi.object({
  reason: Joi.string().max(500).required(),
});

/**
 * Get posts query validation schema
 */
export const getPostsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid(...Object.values(POST_STATUS)),
  authorId: objectId,
  categoryId: objectId,
  tagId: objectId,
  search: Joi.string().trim(),
  sortBy: Joi.string().valid('createdAt', 'publishedAt', 'title', 'viewsCount', 'likesCount').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

export default {
  createPostSchema,
  updatePostSchema,
  rejectPostSchema,
  getPostsQuerySchema,
};
