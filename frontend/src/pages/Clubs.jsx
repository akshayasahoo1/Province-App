import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clubsAPI } from '../lib/api';
import { useUIStore } from '../store';

const STATIC = [
  { id:'cp', name:'CodeForces Club', icon:'💻', category:'Tech', description:'Competitive programming — LeetCode, Codeforces, CodeChef weekly contests', member_count:1240, meet_day:'Every Saturday, 7 PM', location:'Block 37, Lab 4' },
  { id:'ff', name:'Free Fire Esports', icon:'🎮', category:'Gaming', description:'Official LPU team — ranked scrims, tournaments, IGL coaching', member_count:890, meet_day:'Daily, 8–10 PM', location:'E-Sports Arena, Block 56' },
  { id:'robotics', name:'Robotics Club', icon:'🤖', category:'Tech', description:'Robocon, drone racing, IoT projects, smart campus builds', member_count:560, meet_day:'Wed & Fri, 4 PM', location:'Robotics Lab, Block 38' },
  { id:'chess', name:'Chess & Strategy', icon:'♟️', category:'Academic', description:'Chess, sudoku, strategy games — FIDE rated coaching', member_count:340, meet_day:'Tuesdays, 5 PM', location:'Common Room, Block 32' },
  { id:'photo', name:'Photography Circle', icon:'📷', category:'Arts', description:'Campus shoots, Lightroom workshops, photo walks', member_count:780, meet_day:'Sundays, 6 AM', location:'Photography Studio, Block 42' },
  { id:'music', name:'Music Society', icon:'🎵', category:'Arts', description:'Vocal training, recording studio, live jam sessions, Battle of Bands', member_count:920, meet_day:'Mon & Thu, 6 PM', location:'Music Room, Block 45' },
  { id:'startup', name:'Startup Hub', icon:'🚀', category:'Business', description:'Pitching, startup validation, networking with investors', member_count:530, meet_day:'Wednesdays, 6 PM', location:'Innovation Centre, Block 40' },
  { id:'sports', name:'Sports Council', icon:'⚽', category:'Sports', description:'Football, cricket, badminton, athletics — inter-university teams', member_count:1500, meet_day:'Daily, 5:30 AM & 4 PM', location:'Sports Complex' },
  { id:'film', name:'Film & Media Club', icon:'🎬', category:'Arts', description:'Short films, video editing, YouTube content creation', member_count:410, meet_day:'Thursdays, 6 PM', location:'Media Lab, Block 42' },
  { id:'quiz', name:'Quizzing Society', icon:'🧠', category:'Academic', description:'GK quizzes, KBC format, inter-college championships', member_count:320, meet_day:'Tuesdays, 7 PM', location:'Seminar Hall B, Block 34' },
  { id:'green', name:'LPU Green Club', icon:'🌱', category:'Tech', description:'Sustainability, plantation, zero-plastic campaigns', member_count:670, meet_day:'Saturdays, 8 AM', location:'Garden, Block 1' },
  { id:'debate', name:'Debate Club', icon:'🎙️', category:'Academic', description:'MUN, parliamentary debates, public speaking, elocution', member_count:450, meet_day:'Fridays, 5 PM', location:'Seminar Hall, Block 32' },
];

const CATS = ['All','Tech','Gaming','Arts','Sports','Academic','Business'];

export default function Clubs() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [clubs, setClubs] = useState(STATIC);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    clubsAPI.getAll({ inst_id: 'lpu' }).then(r => { if (r.data.clubs?.length) setClubs(r.data.clubs); }).catch(() => {});
  }, []);

  const filtered = filter === 'All' ? clubs : clubs.filter(c => c.category === filter);

  return (
    <div className="max-w-5xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">🎮 Clubs & Communities</h1>
      <p className="text-sm text-white/40 mb-6">Find your people — compete, create & connect</p>
      <div className="flex gap-2 flex-wrap mb-6">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === c ? 'bg-brand border-brand text-white' : 'bg-bg-3 border-white/10 text-white/50 hover:text-white'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-bg-2 border border-white/[0.06] rounded-2xl p-5 text-center hover:border-white/10 hover:-translate-y-0.5 transition-all">
            <div className="text-4xl mb-3">{c.icon}</div>
            <div className="font-display text-base font-bold mb-1.5">{c.name}</div>
            <div className="text-xs text-white/35 leading-relaxed mb-3">{c.description}</div>
            <div className="text-xs text-white/30 mb-1">👥 {c.member_count?.toLocaleString()} members</div>
            <div className="text-xs text-white/25 mb-1">📅 {c.meet_day}</div>
            <div className="text-xs text-white/20 mb-4">📍 {c.location}</div>
            <button onClick={() => showToast(`Joined ${c.name}! Welcome 🎉`)}
              className="w-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold rounded-xl py-2.5 hover:bg-brand hover:text-white transition-all">
              Join Club
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
