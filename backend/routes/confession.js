const router = require('express').Router();
const supabase = require('../lib/supabase');
router.get('/', async (req, res) => {
  const { inst_id = 'lpu', page = 1 } = req.query;
  const limit = 20; const offset = (page - 1) * limit;
  const { data, error } = await supabase.from('confessions').select('*').eq('inst_id', inst_id).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  if (error) return res.status(500).json({ error: 'Could not fetch confessions' });
  res.json({ confessions: data });
});
router.post('/', async (req, res) => {
  const { inst_id = 'lpu', text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Text required' });
  const { data, error } = await supabase.from('confessions').insert({ inst_id, text: text.trim() }).select().single();
  if (error) return res.status(500).json({ error: 'Could not post confession' });
  res.status(201).json({ confession: data });
});
router.post('/:id/react', async (req, res) => {
  const { type } = req.body; // 'hearts' or 'laughs'
  const col = type === 'laughs' ? 'laughs' : 'hearts';
  await supabase.rpc('increment_reaction', { row_id: req.params.id, col_name: col });
  res.json({ message: 'Reacted!' });
});
module.exports = router;
