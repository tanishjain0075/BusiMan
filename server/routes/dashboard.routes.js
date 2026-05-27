const express = require('express');
const router = express.Router();
const { getStats, getRevenueChart, getTopProducts } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/stats', getStats);
router.get('/revenue-chart', getRevenueChart);
router.get('/top-products', getTopProducts);

module.exports = router;
