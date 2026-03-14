const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping', 'bogo'],
      required: true,
    },
    value: {
      // For percentage: 0-100, for fixed: dollar amount, for free_shipping/bogo: 0
      type: Number,
      default: 0,
    },
    minOrder: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Discount = mongoose.model('Discount', discountSchema);
module.exports = Discount;
