import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const createPostSchema = Joi.object({
  title: Joi.string().max(200).required(),
  content: Joi.string().required(),
  categories: Joi.array().items(objectId).optional(),
  tags: Joi.array().items(objectId).optional(),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().max(200),
  content: Joi.string(),
  status: Joi.string().valid('draft', 'pending', 'approved', 'rejected', 'published', 'unpublished'),
  categories: Joi.array().items(objectId),
  tags: Joi.array().items(objectId),
}).min(1);

export const postIdParamSchema = Joi.object({
  postId: objectId.required(),
});

export const getPostsQuerySchema = Joi.object({
  authorId: objectId.optional(),
  categoryId: objectId.optional(),
  tagId: objectId.optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'title').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});
