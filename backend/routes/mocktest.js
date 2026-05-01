const router = require('express').Router();
const supabase = require('../lib/supabase');
router.get('/', async (req, res) => {
  const { inst_id = 'lpu', course, difficulty } = req.query;
  let q = supabase.from('mock_tests').select('*').eq('inst_id', inst_id);
  if (course && course !== 'ALL') q = q.eq('course', course);
  if (difficulty) q = q.eq('difficulty', difficulty);
  const { data, error } = await q.order('attempts', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not fetch tests' });
  res.json({ tests: data });
});
module.exports = router;
