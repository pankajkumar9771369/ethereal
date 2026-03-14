const Subscriber = require('../models/subscriberModel');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: 'Already subscribed! Welcome back.' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ message: 'Thank you for subscribing!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { subscribe };
