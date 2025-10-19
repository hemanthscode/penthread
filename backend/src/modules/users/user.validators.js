import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().max(100),
  email: Joi.string().email(),
  role: Joi.string().valid('admin', 'author', 'user'),
  isActive: Joi.boolean(),
}).min(1);

export const updateProfileSchema = Joi.object({
  name: Joi.string().max(100),
  email: Joi.string().email(),
}).min(1);

export const updateRoleSchema = Joi.object({
  role: Joi.string().valid('admin', 'author', 'user').required(),
});

export const updateStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});
