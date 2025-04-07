import Joi from 'joi';

export const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required(),
  avatar: Joi.string().uri().required()
});