/**
 * Category Validators
 * 
 * Joi schemas for validating category requests.
 * 
 * @module modules/categories/validators
 */

import Joi from 'joi';

/**
 * Create category validation schema
 */
export const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Category name must be at least 2 characters',
      'string.max': 'Category name must not exceed 100 characters',
      'any.required': 'Category name is required',
    }),
  description: Joi.string()
    .trim()
    .max(300)
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 300 characters',
    }),
});

/**
 * Update category validation schema
 */
export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().max(300).allow(''),
}).min(1);

export default {
  createCategorySchema,
  updateCategorySchema,
};
