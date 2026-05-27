export const calculateGST = ({ unitPrice, quantity, gstRate, isInterState }) => {
  const subtotal = parseFloat((unitPrice * quantity).toFixed(2));
  const gstAmount = parseFloat(((subtotal * gstRate) / 100).toFixed(2));

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterState) {
    igst = gstAmount;
  } else {
    cgst = parseFloat((gstAmount / 2).toFixed(2));
    sgst = parseFloat((gstAmount / 2).toFixed(2));
  }

  const lineTotal = parseFloat((subtotal + gstAmount).toFixed(2));

  return { subtotal, cgst, sgst, igst, lineTotal };
};
