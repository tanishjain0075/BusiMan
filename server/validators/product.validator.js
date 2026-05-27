const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().trim().required(),
  sku: Joi.string().trim().uppercase().optional(),
  description: Joi.string().allow('', null).optional(),
  category: Joi.string().hex().length(24).required(),
  unit: Joi.string().valid('pcs', 'kg', 'litre', 'box', 'dozen').default('pcs'),
  costPrice: Joi.number().min(0).required(),
  sellingPrice: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).default(0),
  lowStockThreshold: Joi.number().min(0).default(10),
  images: Joi.array().items(Joi.string().uri()).optional(),
  isActive: Joi.boolean().optional(),
});

const updateProductSchema = productSchema.fork(
  ['name', 'category', 'costPrice', 'sellingPrice'],
  (field) => field.optional()
);

module.exports = { productSchema, updateProductSchema };
