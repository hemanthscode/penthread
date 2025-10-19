import Joi from 'joi';

export const createPostSchema = Joi.object({
  title: Joi.string().max(200).required(),
  content: Joi.string().required(),
  categories: Joi.array().items(Joi.string().hex().length(24)).optional(),
  tags: Joi.array().items(Joi.string().hex().length(24)).optional(),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().max(200),
  content: Joi.string(),
  status: Joi.string().valid('draft', 'pending', 'approved', 'rejected', 'published', 'unpublished'),
  categories: Joi.array().items(Joi.string().hex().length(24)),
  tags: Joi.array().items(Joi.string().hex().length(24)),
}).min(1);
