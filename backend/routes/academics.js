const router = require('express').Router();
const supabase = require('../lib/supabase');
router.get('/courses', async (req, res) => {
  const { inst_id = 'lpu' } = req.query;
  const { data, error } = await supabase.from('courses').select('*').eq('inst_id', inst_id);
  if (error) return res.status(500).json({ error: 'Could not fetch courses' });
  res.json({ courses: data });
});
router.get('/courses/:courseId/subjects', async (req, res) => {
  const { sem } = req.query;
  let q = supabase.from('subjects').select('*, chapters(*)').eq('course_id', req.params.courseId);
  if (sem) q = q.eq('semester', parseInt(sem));
  const { data, error } = await q.order('semester').order('code');
  if (error) return res.status(500).json({ error: 'Could not fetch subjects' });
  res.json({ subjects: data });
});
router.get('/resources/:chapterId', async (req, res) => {
  const { data, error } = await supabase.from('resources').select('*').eq('chapter_id', req.params.chapterId).order('type');
  if (error) return res.status(500).json({ error: 'Could not fetch resources' });
  res.json({ resources: data });
});
module.exports = router;
