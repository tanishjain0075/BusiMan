const Joi = require('joi');

const lineItemSchema = Joi.object({
  product: Joi.string().hex().length(24).optional(),
  productName: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  unit: Joi.string().valid('pcs', 'kg', 'litre', 'box', 'dozen').optional(),
  unitPrice: Joi.number().min(0).required(),
  gstRate: Joi.number().min(0).max(100).default(18),
});

const invoiceSchema = Joi.object({
  client: Joi.string().hex().length(24).required(),
  items: Joi.array().items(lineItemSchema).min(1).required(),
  isInterState: Joi.boolean().default(false),
  paymentMode: Joi.string().valid('cash', 'upi', 'bank_transfer', 'cheque', 'credit').optional(),
  dueDate: Joi.date().optional(),
  notes: Joi.string().allow('', null).optional(),
});

module.exports = { invoiceSchema };
