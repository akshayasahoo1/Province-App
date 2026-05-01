const router = require('express').Router();
const supabase = require('../lib/supabase');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
router.get('/:inst_id', async (req, res) => {
  const { data, error } = await supabase.from('chat_messages').select('id, user_name, message, created_at').eq('inst_id', req.params.inst_id).order('created_at', { ascending: true }).limit(100);
  if (error) return res.status(500).json({ error: 'Could not fetch messages' });
  res.json({ messages: data });
});
router.post('/', optionalAuth, async (req, res) => {
  const { inst_id = 'lpu', message } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Message required' });
  const user_name = req.user ? 'User' : 'Anonymous';
  const { data, error } = await supabase.from('chat_messages').insert({ inst_id, user_id: req.user?.id || null, user_name, message: message.trim() }).select().single();
  if (error) return res.status(500).json({ error: 'Could not send message' });
  res.status(201).json({ message: data });
});
module.exports = router;
