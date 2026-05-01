const router = require('express').Router();
const supabase = require('../lib/supabase');
router.get('/', async (req, res) => {
  try {
    const { inst_id = 'lpu', type, max_price, verified } = req.query;
    let q = supabase.from('pg_listings').select('*').eq('inst_id', inst_id);
    if (type && type !== 'all') q = q.eq('type', type);
    if (max_price) q = q.lte('price', parseInt(max_price));
    if (verified === 'true') q = q.eq('verified', true);
    const { data, error } = await q.order('verified', { ascending: false }).order('rating', { ascending: false });
    if (error) throw error;
    res.json({ listings: data });
  } catch (err) { res.status(500).json({ error: 'Could not fetch PG listings' }); }
});
module.exports = router;
