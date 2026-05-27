const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
} = require('../controllers/invoice.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { invoiceSchema } = require('../validators/invoice.validator');

router.use(protect);

router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/', authorize('admin', 'accountant', 'sales'), validate(invoiceSchema), createInvoice);
router.patch('/:id/status', authorize('admin', 'accountant'), updateInvoiceStatus);
router.delete('/:id', authorize('admin'), deleteInvoice);

module.exports = router;
