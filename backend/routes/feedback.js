const router = require('express').Router();
const supabase = require('../lib/supabase');
const { optionalAuth } = require('../middleware/auth');
router.post('/', optionalAuth, async (req, res) => {
  const { inst_id = 'lpu', category, title, description, location, anonymous } = req.body;
  if (!category || !title) return res.status(400).json({ error: 'Category and title required' });
  const { data, error } = await supabase.from('feedback').insert({ inst_id, user_id: anonymous ? null : req.user?.id, category, title, description, location, anonymous: !!anonymous }).select().single();
  if (error) return res.status(500).json({ error: 'Could not submit feedback' });
  res.status(201).json({ message: 'Feedback submitted!', feedback: data });
});
router.get('/', async (req, res) => {
  const { inst_id = 'lpu', status } = req.query;
  let q = supabase.from('feedback').select('id, category, title, status, created_at').eq('inst_id', inst_id);
  if (status) q = q.eq('status', status);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not fetch feedback' });
  res.json({ feedback: data });
});
module.exports = router;
