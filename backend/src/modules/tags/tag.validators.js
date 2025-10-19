import Joi from 'joi';

export const createTagSchema = Joi.object({
  name: Joi.string().max(50).required(),
});

export const updateTagSchema = Joi.object({
  name: Joi.string().max(50),
}).min(1);
