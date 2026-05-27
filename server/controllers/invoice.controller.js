const Invoice = require('../models/Invoice.model');
const Client = require('../models/Client.model');
const { calculateGST } = require('../utils/gst.utils');
const { generateInvoiceNumber } = require('../utils/invoiceNumber.utils');

const createInvoice = async (req, res, next) => {
  try {
    const { client, items, isInterState = false, paymentMode, dueDate, notes } = req.body;

    const invoiceNumber = await generateInvoiceNumber();

    let subtotal = 0, cgstTotal = 0, sgstTotal = 0, igstTotal = 0;

    const processedItems = items.map((item) => {
      const gst = calculateGST({
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        gstRate: item.gstRate ?? 18,
        isInterState,
      });

      subtotal += gst.subtotal;
      cgstTotal += gst.cgst;
      sgstTotal += gst.sgst;
      igstTotal += gst.igst;

      return {
        ...item,
        cgst: gst.cgst,
        sgst: gst.sgst,
        igst: gst.igst,
        lineTotal: gst.lineTotal,
      };
    });

    const round2 = (v) => Math.round(v * 100) / 100;
    const total = round2(subtotal + cgstTotal + sgstTotal + igstTotal);

    const invoice = await Invoice.create({
      invoiceNumber,
      client,
      items: processedItems,
      subtotal: round2(subtotal),
      cgstTotal: round2(cgstTotal),
      sgstTotal: round2(sgstTotal),
      igstTotal: round2(igstTotal),
      total,
      isInterState,
      paymentMode,
      dueDate,
      notes,
      createdBy: req.user._id,
    });

    await Client.findByIdAndUpdate(client, { $inc: { totalPurchases: total } });

    const populated = await invoice.populate('client', 'name email businessName');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const { status, client, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (client) filter.client = client;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate('client', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Invoice.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: invoices.length,
      totalPages: Math.ceil(total / parseInt(limit)),
      data: invoices,
    });
  } catch (err) {
    next(err);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    if (invoice.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Only draft invoices can be deleted.' });
    }
    await invoice.deleteOne();
    res.status(200).json({ success: true, message: 'Invoice deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInvoices, getInvoice, createInvoice, updateInvoiceStatus, deleteInvoice };
