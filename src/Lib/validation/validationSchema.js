const Joi = require("joi");

exports.schemas = {
  userSchema: Joi.object().keys({
    name: Joi.string(),
    lastname: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
  }),
  loginSchema: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),
};
