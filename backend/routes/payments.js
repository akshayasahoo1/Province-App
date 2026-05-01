const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
// Razorpay integration (add when ready to take payments)
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const order = await razorpay.orders.create({ amount: req.body.amount * 100, currency: 'INR', receipt: `order_${Date.now()}` });
    // res.json({ order });
    res.json({ message: 'Razorpay integration ready — uncomment code and add keys' });
  } catch (err) {
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});
module.exports = router;
