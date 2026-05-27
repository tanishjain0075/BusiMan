const Joi = require('joi');

const addressSchema = Joi.object({
  line1: Joi.string().allow('', null).optional(),
  city: Joi.string().allow('', null).optional(),
  state: Joi.string().allow('', null).optional(),
  pincode: Joi.string().allow('', null).optional(),
});

const clientSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().allow('', null).optional(),
  phone: Joi.string().trim().allow('', null).optional(),
  gstin: Joi.string().trim().uppercase().allow('', null).optional(),
  businessName: Joi.string().trim().allow('', null).optional(),
  address: addressSchema.optional(),
  isActive: Joi.boolean().optional(),
});

const updateClientSchema = clientSchema.fork(['name'], (field) => field.optional());

module.exports = { clientSchema, updateClientSchema };
