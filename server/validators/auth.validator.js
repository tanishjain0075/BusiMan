const Joi = require('joi');

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
    }),
  role: Joi.string().valid('admin', 'inventory_manager', 'accountant', 'sales', 'viewer').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
