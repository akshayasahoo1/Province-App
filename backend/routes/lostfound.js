const router = require('express').Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');
router.get('/', async (req, res) => {
  const { inst_id = 'lpu', type } = req.query;
  let q = supabase.from('lost_found').select('*, users(name)').eq('inst_id', inst_id).eq('resolved', false);
  if (type && type !== 'all') q = q.eq('type', type);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not fetch' });
  res.json({ items: data });
});
router.post('/', authMiddleware, async (req, res) => {
  const { inst_id = 'lpu', type, title, description, location } = req.body;
  if (!type || !title) return res.status(400).json({ error: 'type and title required' });
  const { data, error } = await supabase.from('lost_found').insert({ inst_id, user_id: req.user.id, type, title, description, location }).select().single();
  if (error) return res.status(500).json({ error: 'Could not post' });
  res.status(201).json({ item: data });
});
router.patch('/:id/resolve', authMiddleware, async (req, res) => {
  await supabase.from('lost_found').update({ resolved: true }).eq('id', req.params.id).eq('user_id', req.user.id);
  res.json({ message: 'Marked as resolved!' });
});
module.exports = router;
