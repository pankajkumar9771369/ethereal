const express = require('express');
const router = express.Router();
const { createDiscount, getDiscounts, applyDiscount, deleteDiscount, getLatestActiveDiscount } = require('../controllers/discountController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/apply', applyDiscount);
router.get('/latest', getLatestActiveDiscount);
router.route('/').get(protect, admin, getDiscounts).post(protect, admin, createDiscount);
router.delete('/:id', protect, admin, deleteDiscount);

module.exports = router;
