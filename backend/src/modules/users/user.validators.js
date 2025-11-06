/**
 * User Validators
 * 
 * Joi schemas for validating user management requests.
 * 
 * @module modules/users/validators
 */

import Joi from 'joi';
import { ROLES } from '../../utils/constants.js';

/**
 * Update user validation schema (admin)
 */
export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().email().lowercase(),
  bio: Joi.string().max(500).allow(''),
  avatar: Joi.string().uri().allow(''),
}).min(1);

/**
 * Update profile validation schema (own profile)
 */
export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  bio: Joi.string().max(500).allow(''),
  avatar: Joi.string().uri().allow(''),
}).min(1);

/**
 * Update role validation schema
 */
export const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      'any.only': 'Invalid role specified',
      'any.required': 'Role is required',
    }),
});

/**
 * Update status validation schema
 */
export const updateStatusSchema = Joi.object({
  isActive: Joi.boolean()
    .required()
    .messages({
      'any.required': 'Status is required',
    }),
});

/**
 * Get users query validation schema
 */
export const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  role: Joi.string().valid(...Object.values(ROLES)),
  isActive: Joi.string().valid('true', 'false'),
  search: Joi.string().trim(),
});

export default {
  updateUserSchema,
  updateProfileSchema,
  updateRoleSchema,
  updateStatusSchema,
  getUsersQuerySchema,
};
