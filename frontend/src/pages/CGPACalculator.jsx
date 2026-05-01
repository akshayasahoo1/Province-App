import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GRADES = { 'O':10,'A+':9,'A':8,'B+':7,'B':6,'C':5,'D':4,'F':0 };

export default function CGPACalculator() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([
    { id:1, name:'Subject 1', credits:4, grade:'A' },
    { id:2, name:'Subject 2', credits:3, grade:'B+' },
    { id:3, name:'Subject 3', credits:4, grade:'A+' },
    { id:4, name:'Subject 4', credits:4, grade:'B' },
  ]);
  const [prevCGPA, setPrevCGPA] = useState('');
  const [prevSems, setPrevSems] = useState('');

  const totalPts = rows.reduce((s, r) => s + (GRADES[r.grade]||0) * (r.credits||0), 0);
  const totalCr = rows.reduce((s, r) => s + (r.credits||0), 0);
  const sgpa = totalCr > 0 ? (totalPts / totalCr).toFixed(2) : '0.00';
  const newCGPA = prevCGPA && prevSems ? (((parseFloat(prevCGPA)*parseInt(prevSems)) + parseFloat(sgpa)) / (parseInt(prevSems)+1)).toFixed(2) : null;

  const update = (id, key, val) => setRows(rs => rs.map(r => r.id===id ? {...r,[key]:val} : r));
  const add = () => setRows(rs => [...rs, { id:Date.now(), name:`Subject ${rs.length+1}`, credits:3, grade:'B' }]);
  const remove = (id) => setRows(rs => rs.filter(r => r.id!==id));

  const inputCls = "bg-bg-3 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-brand/50 transition-all";

  return (
    <div className="max-w-2xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">📊 CGPA Calculator</h1>
      <p className="text-sm text-white/40 mb-6">Calculate your SGPA & cumulative CGPA instantly</p>

      <div className="bg-gradient-to-br from-brand to-brand-2 rounded-2xl p-8 text-center mb-6">
        <div className="font-display text-7xl font-black text-white leading-none">{sgpa}</div>
        <div className="text-white/70 text-sm mt-2">SGPA this semester</div>
        {newCGPA && <div className="mt-3 bg-white/10 rounded-xl px-4 py-2 text-white text-sm font-medium">New CGPA: {newCGPA}</div>}
      </div>

      <div className="bg-bg-2 border border-white/[0.06] rounded-2xl p-5 mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/30">Subjects</span>
          <button onClick={add} className="bg-brand/10 border border-brand/25 text-brand text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-brand hover:text-white transition-all">+ Add Subject</button>
        </div>
        <div className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2">
              <input className={`${inputCls} flex-1`} value={r.name} onChange={e => update(r.id,'name',e.target.value)} placeholder="Subject name" />
              <input className={`${inputCls} w-16 text-center`} type="number" value={r.credits} onChange={e => update(r.id,'credits',parseInt(e.target.value)||0)} min="1" max="6" />
              <select className={`${inputCls} w-20`} value={r.grade} onChange={e => update(r.id,'grade',e.target.value)}>
                {Object.keys(GRADES).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <button onClick={() => remove(r.id)} className="text-white/25 hover:text-red-400 text-lg transition-colors px-1">×</button>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.05] mt-4 pt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/30 block mb-1.5">Previous CGPA</label>
            <input className={inputCls + ' w-full'} type="number" placeholder="e.g. 8.5" min="0" max="10" step="0.01" value={prevCGPA} onChange={e => setPrevCGPA(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-white/30 block mb-1.5">Semesters done</label>
            <input className={inputCls + ' w-full'} type="number" placeholder="e.g. 4" min="0" max="8" value={prevSems} onChange={e => setPrevSems(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
