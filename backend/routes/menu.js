const router = require('express').Router();
const supabase = require('../lib/supabase');
router.get('/:restaurant_id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*').eq('restaurant_id', req.params.restaurant_id).eq('available', true).order('category');
    if (error) throw error;
    res.json({ items: data });
  } catch (err) { res.status(500).json({ error: 'Could not fetch menu' }); }
});
module.exports = router;
