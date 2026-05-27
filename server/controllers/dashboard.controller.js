const Invoice = require('../models/Invoice.model');
const Client = require('../models/Client.model');
const Product = require('../models/Product.model');

const getStats = async (req, res, next) => {
  try {
    const [
      revenueResult,
      totalClients,
      totalProducts,
      totalInvoices,
      lowStockCount,
      pendingInvoices,
    ] = await Promise.all([
      Invoice.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Client.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
      Invoice.countDocuments(),
      Product.countDocuments({
        isActive: true,
        $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
      }),
      Invoice.countDocuments({ status: { $in: ['sent', 'overdue'] } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: revenueResult[0]?.total ?? 0,
        totalClients,
        totalProducts,
        totalInvoices,
        lowStockCount,
        pendingInvoices,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getRevenueChart = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const data = await Invoice.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          revenue: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const data = await Invoice.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.lineTotal' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          productName: '$_id',
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getRevenueChart, getTopProducts };
