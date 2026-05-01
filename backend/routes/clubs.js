const router = require('express').Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');
router.get('/', async (req, res) => {
  const { inst_id = 'lpu', category } = req.query;
  let q = supabase.from('clubs').select('*').eq('inst_id', inst_id);
  if (category && category !== 'all') q = q.eq('category', category);
  const { data, error } = await q.order('member_count', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not fetch clubs' });
  res.json({ clubs: data });
});
router.post('/:id/join', authMiddleware, async (req, res) => {
  await supabase.from('club_members').upsert({ club_id: req.params.id, user_id: req.user.id });
  await supabase.rpc('increment_club_members', { club_id: req.params.id });
  res.json({ message: 'Joined club!' });
});
module.exports = router;
