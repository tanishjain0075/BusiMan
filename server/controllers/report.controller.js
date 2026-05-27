const Invoice = require('../models/Invoice.model');
const Product = require('../models/Product.model');
const Client = require('../models/Client.model');

const getSalesReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = {};

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const invoices = await Invoice.find(filter)
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    const totals = invoices.reduce(
      (acc, inv) => {
        acc.subtotal += inv.subtotal;
        acc.tax += inv.cgstTotal + inv.sgstTotal + inv.igstTotal;
        acc.total += inv.total;
        return acc;
      },
      { subtotal: 0, tax: 0, total: 0 }
    );

    const round2 = (v) => Math.round(v * 100) / 100;

    res.status(200).json({
      success: true,
      data: {
        invoices,
        summary: {
          count: invoices.length,
          subtotal: round2(totals.subtotal),
          tax: round2(totals.tax),
          total: round2(totals.total),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const getInventoryReport = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).populate('category', 'name');

    const data = products.map((p) => ({
      id: p._id,
      name: p.name,
      sku: p.sku,
      category: p.category?.name,
      quantity: p.quantity,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      inventoryValue: Math.round(p.quantity * p.costPrice * 100) / 100,
      isLowStock: p.isLowStock,
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

const getClientReport = async (req, res, next) => {
  try {
    const data = await Client.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'invoices',
          localField: '_id',
          foreignField: 'client',
          as: 'invoices',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          businessName: 1,
          totalPurchases: 1,
          invoiceCount: { $size: '$invoices' },
        },
      },
      { $sort: { totalPurchases: -1 } },
    ]);

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSalesReport, getInventoryReport, getClientReport };
