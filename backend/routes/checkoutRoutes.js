const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  stripeWebhook,
  verifyAndCreateOrder,
} = require('../controllers/checkoutController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-session', createCheckoutSession);
router.get('/session/:sessionId', protect, verifyAndCreateOrder);

// Webhook needs raw body for signature verification if using a real secret, 
// handled at the server.js level or directly here via express.raw.
// For this training, we use standard json parsing with a fallback.
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
