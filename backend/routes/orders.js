// ============================================
// ProvinceApp — Orders Routes
// POST /api/orders
// GET  /api/orders/my
// PATCH /api/orders/:id/status
// ============================================
const router = require('express').Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

// PLACE ORDER
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurant_id, items, total } = req.body;
    if (!restaurant_id || !items?.length || !total) {
      return res.status(400).json({ error: 'restaurant_id, items, total required' });
    }
    const { data: order, error } = await supabase.from('orders')
      .insert({ user_id: req.user.id, restaurant_id, total, status: 'pending' })
      .select().single();
    if (error) throw error;

    // Insert order items
    const orderItems = items.map(i => ({ order_id: order.id, ...i }));
    await supabase.from('order_items').insert(orderItems);

    res.status(201).json({ message: 'Order placed!', order });
  } catch (err) {
    res.status(500).json({ error: 'Could not place order' });
  }
});

// GET MY ORDERS
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders')
      .select('*, restaurants(name, emoji)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch orders' });
  }
});

module.exports = router;
