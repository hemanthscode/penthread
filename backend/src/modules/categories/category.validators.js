import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(300).allow('', null),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().max(300).allow('', null),
}).min(1);
