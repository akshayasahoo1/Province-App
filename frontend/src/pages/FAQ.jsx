import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faqAPI } from '../lib/api';

const STATIC = [
  { id:1, category:'Exams', question:'What is the passing criteria in LPU?', answer:'Students must score minimum 40% (Grade D or above) in each subject. Practical/lab subjects require 50% minimum. CGPA must stay above 4.0 to avoid academic probation.' },
  { id:2, category:'Exams', question:'How many chances for re-appearing in exams?', answer:'Maximum 2 re-appear chances for theory subjects. Only 1 re-appear for practicals. Re-appear fees apply from the second attempt.' },
  { id:3, category:'Grades', question:'What is the grading system at LPU?', answer:'10-point CGPA scale: O=10, A+=9, A=8, B+=7, B=6, C=5, D=4 (Pass), F=0 (Fail). SGPA calculated each semester.' },
  { id:4, category:'Attendance', question:'What is the minimum attendance required?', answer:'75% attendance minimum to appear in end-term exams. Medical leave requires documentation within 3 working days.' },
  { id:5, category:'Exams', question:'What is the exam pattern for BTech?', answer:'Mid-term: 20 marks. End-term: 80 marks. Internal assessment contributes 30% through assignments, quizzes, and class participation.' },
  { id:6, category:'UMS', question:'How do I check my results on UMS?', answer:'Login to ums.lpu.in → Academic Reports → Semester Results. Published within 15 working days after exams.' },
  { id:7, category:'Fees', question:'What is the fee payment deadline?', answer:'July 15 (odd sem) and January 15 (even sem). Late payment: ₹500/day penalty. EMI options via SBI, PNB, HDFC.' },
  { id:8, category:'Hostel', question:'What are hostel curfew timings?', answer:'Boys: 11 PM. Girls: 9 PM. Entry/exit logged via biometric.' },
  { id:9, category:'Backlogs', question:'How to clear backlogs?', answer:'Register for supplementary exams held twice a year. Maximum 5 active backlogs per semester. Backlog fee: ₹2,500/subject.' },
  { id:10, category:'Fees', question:'What scholarships are available?', answer:"Chancellor's Scholarship (top 1% JEE), Academic Excellence (top 5%), need-based aid, sports/cultural scholarships. Apply before July 31." },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState(STATIC);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null);

  useEffect(() => {
    faqAPI.getAll({ inst_id: 'lpu' }).then(r => { if (r.data.faqs?.length) setFaqs(r.data.faqs.map(f => ({ ...f, question: f.question, answer: f.answer }))); }).catch(() => {});
  }, []);

  const filtered = faqs.filter(f => !search || f.question?.toLowerCase().includes(search.toLowerCase()) || f.answer?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">❓ FAQ & Academic Info</h1>
      <p className="text-sm text-white/40 mb-6">Everything about LPU academics, exams, grades & policies</p>
      <input className="w-full bg-bg-2 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-brand/50 mb-5 transition-all"
        placeholder="Search questions…" value={search} onChange={e => setSearch(e.target.value)} />
      <div className="flex flex-col gap-1.5">
        {filtered.map(f => (
          <div key={f.id} className={`bg-bg-2 border rounded-xl overflow-hidden cursor-pointer transition-all ${open === f.id ? 'border-white/10' : 'border-white/[0.06]'}`}
            onClick={() => setOpen(open === f.id ? null : f.id)}>
            <div className="flex items-center gap-3 px-4 py-4">
              <span className="flex-1 text-sm font-medium">{f.question}</span>
              <span className="text-xs bg-bg-4 text-white/40 px-2 py-0.5 rounded-full shrink-0">{f.category}</span>
              <span className={`text-xs text-white/30 transition-transform shrink-0 ${open === f.id ? 'rotate-180' : ''}`}>▾</span>
            </div>
            {open === f.id && (
              <div className="px-4 pb-4 text-sm text-white/50 leading-relaxed border-t border-white/[0.05] pt-3">{f.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
