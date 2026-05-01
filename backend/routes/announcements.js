const router = require('express').Router();
const supabase = require('../lib/supabase');
router.get('/', async (req, res) => {
  const { inst_id = 'lpu' } = req.query;
  const { data, error } = await supabase.from('announcements').select('*').eq('inst_id', inst_id).eq('active', true).order('created_at', { ascending: false }).limit(10);
  if (error) return res.status(500).json({ error: 'Could not fetch announcements' });
  res.json({ announcements: data });
});
module.exports = router;
