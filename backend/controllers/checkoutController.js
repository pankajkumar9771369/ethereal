const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Create Stripe Checkout Session
// @route   POST /api/checkout/create-session
// @access  Public
const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, userId } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    const lineItems = cartItems.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
            metadata: {
              productId: item._id,
            },
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.qty,
      };
    });

    const frontendUrl = req.headers.origin || 'https://ethereal-5.onrender.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'IN', 'AU', 'SG', 'AE'],
      },
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cart`,
      metadata: {
        userId: userId || '',
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            id: item._id,
            qty: item.qty,
            name: item.name,
            price: item.price,
            image: item.image,
          }))
        ),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stripe Webhook handler
// @route   POST /api/checkout/webhook
// @access  Public (Called by Stripe)
const stripeWebhook = async (req, res) => {
  // We need the raw body to verify Stripe signature
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // In dev mode, we might skip signature validation if testing locally without CLI.
    // For a real app, use the webhook secret
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } else {
      event = req.body; // Fallback for local testing without webhook secret
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Create order from session metadata
      const items = JSON.parse(session.metadata.cartItems);
      
      const orderItems = items.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.id,
      }));

      const order = new Order({
        user: session.metadata.userId || '650e2b4f9a7d3c0000000000',
        orderItems,
        shippingAddress: {
          address: session.shipping_details?.address?.line1 || 'N/A',
          city: session.shipping_details?.address?.city || 'N/A',
          postalCode: session.shipping_details?.address?.postal_code || 'N/A',
          country: session.shipping_details?.address?.country || 'N/A',
        },
        paymentMethod: 'Stripe',
        paymentResult: {
          id: session.payment_intent,
          status: session.payment_status,
          update_time: new Date().toISOString(),
          email_address: session.customer_details?.email || 'N/A',
        },
        taxPrice: 0.0, // Simplification
        shippingPrice: session.total_details?.amount_shipping ? session.total_details.amount_shipping / 100 : 0.0,
        totalPrice: session.amount_total / 100,
        isPaid: true,
        paidAt: new Date(),
      });

      const createdOrder = await order.save();
      console.log('Order created successfully from webhook:', createdOrder._id);

    } catch (error) {
      console.error('Failed to create order from webhook:', error);
    }
  }

  res.status(200).end();
};

// @desc    Verify Stripe session and create order (called from success page — no webhook needed)
// @route   GET /api/checkout/session/:sessionId
// @access  Private
const verifyAndCreateOrder = async (req, res) => {
  try {
    console.log('verifyAndCreateOrder called, sessionId:', req.params.sessionId);
    console.log('Authenticated user:', req.user?._id);

    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    console.log('Stripe session status:', session.payment_status);

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not confirmed by Stripe' });
    }

    // Avoid creating duplicate orders for the same Stripe payment intent
    const existingOrder = await Order.findOne({ 'paymentResult.id': session.payment_intent });
    if (existingOrder) {
      console.log('Order already exists:', existingOrder._id);
      return res.json({ orderId: existingOrder._id, alreadyExists: true });
    }

    // Parse cart items from metadata
    let items = [];
    try {
      items = JSON.parse(session.metadata?.cartItems || '[]');
    } catch (parseErr) {
      console.error('Failed to parse cartItems:', parseErr.message);
      return res.status(400).json({ message: 'Could not read cart items from session' });
    }

    const orderItems = items.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item.id,
    }));

    // Use authenticated user's ID from JWT token — most reliable
    const userId = req.user._id;
    console.log('Creating order for user:', userId, 'with', orderItems.length, 'items');

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress: {
        address: session.shipping_details?.address?.line1 || session.customer_details?.address?.line1 || 'N/A',
        city: session.shipping_details?.address?.city || session.customer_details?.address?.city || 'N/A',
        postalCode: session.shipping_details?.address?.postal_code || session.customer_details?.address?.postal_code || 'N/A',
        country: session.shipping_details?.address?.country || session.customer_details?.address?.country || 'N/A',
      },
      paymentMethod: 'Stripe',
      paymentResult: {
        id: session.payment_intent,
        status: session.payment_status,
        update_time: new Date().toISOString(),
        email_address: session.customer_details?.email || 'N/A',
      },
      taxPrice: 0.0,
      shippingPrice: session.total_details?.amount_shipping ? session.total_details.amount_shipping / 100 : 0.0,
      totalPrice: session.amount_total / 100,
      isPaid: true,
      paidAt: new Date(),
    });

    const createdOrder = await order.save();
    console.log('✅ Order saved:', createdOrder._id);

    res.status(201).json({ orderId: createdOrder._id });
  } catch (error) {
    console.error('❌ verifyAndCreateOrder error:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
  verifyAndCreateOrder,
};
