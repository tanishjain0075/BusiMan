const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
} = require('../controllers/vendor.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { vendorSchema, updateVendorSchema } = require('../validators/vendor.validator');

router.use(protect);

router.get('/', getVendors);
router.get('/:id', getVendor);
router.post('/', authorize('admin', 'inventory_manager'), validate(vendorSchema), createVendor);
router.put('/:id', authorize('admin', 'inventory_manager'), validate(updateVendorSchema), updateVendor);
router.delete('/:id', authorize('admin'), deleteVendor);

module.exports = router;
