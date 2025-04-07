import Joi from 'joi';

export const tweetSchema = Joi.object({
  username: Joi.string().required(),
  tweet: Joi.string().max(300).required()
});