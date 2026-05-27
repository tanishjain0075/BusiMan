const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { productSchema, updateProductSchema } = require('../validators/product.validator');

router.get('/', getProducts);
router.get('/low-stock', protect, getLowStockProducts);
router.get('/:id', getProduct);

router.post('/', protect, authorize('admin', 'inventory_manager'), validate(productSchema), createProduct);
router.put('/:id', protect, authorize('admin', 'inventory_manager'), validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
