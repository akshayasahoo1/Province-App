import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../lib/api';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store';

const STATIC_MSGS = [
  { id:1, user_name:'Arjun S.', message:'Anyone has OOPs notes for Unit 3?', created_at:new Date(Date.now()-1800000).toISOString(), mine:false },
  { id:2, user_name:'Priya K.', message:'Check academics section — I uploaded mine yesterday!', created_at:new Date(Date.now()-1500000).toISOString(), mine:false },
  { id:3, user_name:'Rohan M.', message:'Chole bhature king near gate 2 is 🔥 absolute banger today', created_at:new Date(Date.now()-900000).toISOString(), mine:false },
  { id:4, user_name:'Simran T.', message:'Placement cell: HCL is coming Dec 2nd!', created_at:new Date(Date.now()-600000).toISOString(), mine:false },
  { id:5, user_name:'Dev P.', message:'Anyone up for Free Fire ranked tonight at 9 PM?', created_at:new Date(Date.now()-300000).toISOString(), mine:false },
];

const fmt = (iso) => new Date(iso).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});

export default function Chat() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState(STATIC_MSGS);
  const [input, setInput] = useState('');
  const [online] = useState(Math.floor(Math.random()*80)+80);
  const bottomRef = useRef(null);

  useEffect(() => {
    chatAPI.getMessages('lpu').then(r => { if(r.data.messages?.length) setMessages(r.data.messages.map(m=>({...m,mine:m.user_name==='You'}))); }).catch(()=>{});
    // Real-time subscription
    const channel = supabase.channel('chat-lpu')
      .on('postgres_changes',{ event:'INSERT', schema:'public', table:'chat_messages', filter:'inst_id=eq.lpu' },
        payload => setMessages(m => [...m, { ...payload.new, mine: payload.new.user_name === 'You' }]))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const msg = { id:Date.now(), user_name:user?.name?.split(' ')[0]||'You', message:text, created_at:new Date().toISOString(), mine:true };
    setMessages(m => [...m, msg]);
    setInput('');
    try { await chatAPI.send({ inst_id:'lpu', message:text }); } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">🔥 Campus Live Chat</h1>
        <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">● {online} online</span>
      </div>

      <div className="bg-bg-2 border border-white/[0.06] rounded-2xl overflow-hidden" style={{ height: '480px', display:'flex', flexDirection:'column' }}>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-2 ${m.mine ? 'flex-row-reverse' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-bg-5 flex items-center justify-center text-xs font-bold shrink-0">
                {m.user_name?.charAt(0)}
              </div>
              <div className={`flex flex-col gap-0.5 max-w-[70%] ${m.mine ? 'items-end' : ''}`}>
                {!m.mine && <span className="text-[11px] text-white/30">{m.user_name} · {fmt(m.created_at)}</span>}
                <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                  m.mine
                    ? 'bg-brand text-white rounded-2xl rounded-tr-sm'
                    : 'bg-bg-3 border border-white/[0.06] text-white/80 rounded-2xl rounded-tl-sm'
                }`}>{m.message}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t border-white/[0.06] flex gap-2">
          <input
            className="flex-1 bg-bg-3 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-brand/50 transition-all"
            placeholder="Type a message…" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==='Enter' && send()} />
          <button onClick={send} className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white hover:bg-brand-2 transition-all shrink-0">↑</button>
        </div>
      </div>
    </div>
  );
}
