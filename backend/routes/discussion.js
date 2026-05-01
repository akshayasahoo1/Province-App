const router = require('express').Router();
const supabase = require('../lib/supabase');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
router.get('/', async (req, res) => {
  const { inst_id = 'lpu', category, page = 1 } = req.query;
  const limit = 20; const offset = (page - 1) * limit;
  let q = supabase.from('discussions').select('*, users(name)').eq('inst_id', inst_id);
  if (category && category !== 'all') q = q.eq('category', category);
  const { data, error } = await q.order('pinned', { ascending: false }).order('votes', { ascending: false }).range(offset, offset + limit - 1);
  if (error) return res.status(500).json({ error: 'Could not fetch discussions' });
  res.json({ discussions: data });
});
router.post('/', authMiddleware, async (req, res) => {
  const { inst_id = 'lpu', title, body, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const { data, error } = await supabase.from('discussions').insert({ inst_id, user_id: req.user.id, title, body, category: category || 'General' }).select().single();
  if (error) return res.status(500).json({ error: 'Could not post' });
  res.status(201).json({ discussion: data });
});
router.post('/:id/vote', authMiddleware, async (req, res) => {
  const { delta } = req.body; // 1 or -1
  await supabase.rpc('vote_discussion', { disc_id: req.params.id, delta: delta === 1 ? 1 : -1 });
  res.json({ message: 'Voted!' });
});
module.exports = router;
