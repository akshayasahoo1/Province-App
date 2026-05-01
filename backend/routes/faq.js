const router = require('express').Router();
const supabase = require('../lib/supabase');
router.get('/', async (req, res) => {
  const { inst_id = 'lpu', search } = req.query;
  let q = supabase.from('faqs').select('*').eq('inst_id', inst_id);
  if (search) q = q.ilike('question', `%${search}%`);
  const { data, error } = await q.order('id');
  if (error) return res.status(500).json({ error: 'Could not fetch FAQs' });
  res.json({ faqs: data });
});
module.exports = router;
