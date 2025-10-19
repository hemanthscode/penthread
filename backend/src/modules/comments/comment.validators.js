import Joi from 'joi';

export const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});

export const moderateCommentSchema = Joi.object({
  action: Joi.string().valid('approve', 'reject').required(),
});
