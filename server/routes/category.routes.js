const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.get('/', getCategories);
router.post('/', authorize('admin', 'inventory_manager'), createCategory);
router.put('/:id', authorize('admin', 'inventory_manager'), updateCategory);
router.delete('/:id', authorize('admin'), deleteCategory);

module.exports = router;
