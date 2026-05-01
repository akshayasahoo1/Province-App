// ============================================
// ProvinceApp — Restaurants Routes
// GET  /api/restaurants?inst_id=lpu&filter=all
// GET  /api/restaurants/:id
// POST /api/restaurants (admin only)
// ============================================
const router = require('express').Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET ALL RESTAURANTS
router.get('/', async (req, res) => {
  try {
    const { inst_id = 'lpu', filter, veg } = req.query;
    let query = supabase.from('restaurants').select('*').eq('inst_id', inst_id);
    if (filter === 'open') query = query.eq('open', true);
    if (filter === 'delivery') query = query.eq('delivery', true);
    if (veg === 'true') query = query.eq('veg', true);
    const { data, error } = await query.order('rating', { ascending: false });
    if (error) throw error;
    res.json({ restaurants: data });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch restaurants' });
  }
});

// GET SINGLE RESTAURANT WITH MENU
router.get('/:id', async (req, res) => {
  try {
    const { data: restaurant, error: rErr } = await supabase
      .from('restaurants').select('*').eq('id', req.params.id).single();
    if (rErr) return res.status(404).json({ error: 'Restaurant not found' });

    const { data: menuItems } = await supabase
      .from('menu_items').select('*').eq('restaurant_id', req.params.id).eq('available', true);

    // Group by category
    const categories = menuItems?.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {}) || {};

    res.json({ restaurant, categories });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch restaurant' });
  }
});

module.exports = router;
