const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: [true, 'Invoice reference is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    mode: {
      type: String,
      enum: ['cash', 'upi', 'bank_transfer', 'cheque', 'credit'],
      required: [true, 'Payment mode is required'],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
