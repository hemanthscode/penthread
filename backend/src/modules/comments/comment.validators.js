/**
 * Comment Validators
 * 
 * Joi schemas for validating comment requests.
 * 
 * @module modules/comments/validators
 */

import Joi from 'joi';

/**
 * Create comment validation schema
 */
export const createCommentSchema = Joi.object({
  content: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Comment must not be empty',
      'string.max': 'Comment must not exceed 1000 characters',
      'any.required': 'Comment content is required',
    }),
});

/**
 * Moderate comment validation schema
 */
export const moderateCommentSchema = Joi.object({
  action: Joi.string()
    .valid('approve', 'reject')
    .required()
    .messages({
      'any.only': 'Action must be either approve or reject',
      'any.required': 'Action is required',
    }),
});

export default {
  createCommentSchema,
  moderateCommentSchema,
};
