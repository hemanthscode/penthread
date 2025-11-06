/**
 * Tag Validators
 * 
 * Joi schemas for validating tag requests.
 * 
 * @module modules/tags/validators
 */

import Joi from 'joi';

/**
 * Create tag validation schema
 */
export const createTagSchema = Joi.object({
  name: Joi.string()
    .trim()
    .lowercase()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Tag name must be at least 2 characters',
      'string.max': 'Tag name must not exceed 50 characters',
      'any.required': 'Tag name is required',
    }),
});

/**
 * Update tag validation schema
 */
export const updateTagSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(2).max(50),
}).min(1);

export default {
  createTagSchema,
  updateTagSchema,
};
