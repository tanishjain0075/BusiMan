const round2 = (val) => Math.round(val * 100) / 100;

const calculateGST = ({ unitPrice, quantity, gstRate, isInterState }) => {
  const subtotal = round2(unitPrice * quantity);
  let cgst = 0, sgst = 0, igst = 0;

  if (isInterState) {
    igst = round2(subtotal * gstRate / 100);
  } else {
    cgst = round2(subtotal * (gstRate / 2) / 100);
    sgst = cgst;
  }

  const lineTotal = round2(subtotal + cgst + sgst + igst);
  return { subtotal, cgst, sgst, igst, lineTotal };
};

module.exports = { calculateGST };
