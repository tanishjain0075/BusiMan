const Invoice = require('../models/Invoice.model');

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const latest = await Invoice.findOne({ invoiceNumber: new RegExp(`^INV-${year}-`) })
    .sort({ invoiceNumber: -1 })
    .select('invoiceNumber');

  if (!latest) {
    return `INV-${year}-0001`;
  }

  const parts = latest.invoiceNumber.split('-');
  const nextSeq = parseInt(parts[2], 10) + 1;
  return `INV-${year}-${String(nextSeq).padStart(4, '0')}`;
};

module.exports = { generateInvoiceNumber };
