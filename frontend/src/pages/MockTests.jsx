import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTestAPI } from '../lib/api';
import { useUIStore } from '../store';

const STATIC = [
  { id:'t1', name:'DSA Practice Set 1', subject:'Data Structures & Algorithms', course:'CSE', questions:30, time_min:60, difficulty:'Medium', attempts:2341 },
  { id:'t2', name:'OS Mid-Term Mock', subject:'Operating Systems', course:'CSE', questions:25, time_min:45, difficulty:'Hard', attempts:1890 },
  { id:'t3', name:'DBMS Full Mock', subject:'Database Management Systems', course:'CSE', questions:40, time_min:90, difficulty:'Medium', attempts:3120 },
  { id:'t4', name:'Aptitude + Reasoning Sprint', subject:'Placement Prep', course:'ALL', questions:50, time_min:60, difficulty:'Easy', attempts:5670 },
  { id:'t5', name:'Full Semester 3 Mock', subject:'All Sem 3 Subjects', course:'CSE', questions:100, time_min:180, difficulty:'Hard', attempts:4320 },
  { id:'t6', name:'Java OOP Concepts Test', subject:'OOP with Java', course:'CSE', questions:25, time_min:40, difficulty:'Medium', attempts:1560 },
  { id:'t7', name:'Financial Accounting Quiz', subject:'Financial Accounting', course:'MBA', questions:30, time_min:45, difficulty:'Medium', attempts:678 },
  { id:'t8', name:'CN Chapter 1-3 Quiz', subject:'Computer Networks', course:'CSE', questions:20, time_min:30, difficulty:'Easy', attempts:987 },
];
const diffStyle = { Easy:'bg-green-500/10 text-green-400 border-green-500/20', Medium:'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', Hard:'bg-red-500/10 text-red-400 border-red-500/20' };
const CATS = ['ALL','CSE','MBA','Easy','Medium','Hard'];

export default function MockTests() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [tests, setTests] = useState(STATIC);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    mockTestAPI.getAll({ inst_id:'lpu' }).then(r => { if(r.data.tests?.length) setTests(r.data.tests); }).catch(() => {});
  }, []);

  const filtered = filter === 'ALL' ? tests : tests.filter(t => t.course===filter || t.difficulty===filter);

  return (
    <div className="max-w-4xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">📝 Mock Tests</h1>
      <p className="text-sm text-white/40 mb-6">Practice papers, timed tests & performance analysis</p>
      <div className="flex gap-2 flex-wrap mb-6">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${filter===c?'bg-brand border-brand text-white':'bg-bg-3 border-white/10 text-white/50 hover:text-white'}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-bg-2 border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-center mb-3">
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${diffStyle[t.difficulty]}`}>{t.difficulty}</span>
              <span className="text-xs text-white/25">{t.course}</span>
            </div>
            <div className="font-display text-base font-bold mb-1">{t.name}</div>
            <div className="text-xs text-white/40 mb-3">{t.subject}</div>
            <div className="flex gap-4 text-xs text-white/30 mb-4">
              <span>❓ {t.questions} Qs</span>
              <span>⏱ {t.time_min} min</span>
              <span>👥 {t.attempts?.toLocaleString()}</span>
            </div>
            <button onClick={() => showToast('Starting test… Full engine in Phase 2!')}
              className="w-full bg-brand text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-brand-2 transition-all">
              Start Test →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
