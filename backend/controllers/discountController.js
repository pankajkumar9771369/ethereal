const Discount = require('../models/discountModel');

// @desc    Create discount code (Admin)
// @route   POST /api/discounts
// @access  Private/Admin
const createDiscount = async (req, res) => {
  try {
    const { code, type, value, minOrder, expiresAt } = req.body;
    const existing = await Discount.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Discount code already exists' });
    }
    const discount = await Discount.create({ code, type, value, minOrder, expiresAt });
    res.status(201).json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List all discount codes (Admin)
// @route   GET /api/discounts
// @access  Private/Admin
const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({}).sort({ createdAt: -1 });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply / validate a discount code
// @route   POST /api/discounts/apply
// @access  Public
const applyDiscount = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });

    const discount = await Discount.findOne({ code: code.toUpperCase(), active: true });

    if (!discount) {
      return res.status(404).json({ message: 'Invalid or expired discount code' });
    }

    if (discount.expiresAt && new Date() > discount.expiresAt) {
      return res.status(400).json({ message: 'This discount code has expired' });
    }

    if (orderTotal < discount.minOrder) {
      return res.status(400).json({
        message: `Minimum order of $${discount.minOrder} required for this code`,
      });
    }

    let savings = 0;
    if (discount.type === 'percentage') {
      savings = (orderTotal * discount.value) / 100;
    } else if (discount.type === 'fixed') {
      savings = discount.value;
    } else if (discount.type === 'free_shipping') {
      savings = 0; // handled on frontend
    } else if (discount.type === 'bogo') {
      savings = 0; // handled on frontend
    }

    res.json({
      valid: true,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      savings: Math.min(savings, orderTotal),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete discount (Admin)
// @route   DELETE /api/discounts/:id
// @access  Private/Admin
const deleteDiscount = async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ message: 'Discount removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the latest active discount code
// @route   GET /api/discounts/latest
// @access  Public
const getLatestActiveDiscount = async (req, res) => {
  try {
    const discount = await Discount.findOne({
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    }).sort({ createdAt: -1 });
    
    if (!discount) {
      return res.status(404).json({ message: 'No active discounts found' });
    }
    res.json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDiscount, getDiscounts, applyDiscount, deleteDiscount, getLatestActiveDiscount };
