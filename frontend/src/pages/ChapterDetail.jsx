// ============================================
// PAGE: Chapter Detail
// ============================================
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUIStore } from '../store';

export default function ChapterDetail() {
  const { courseId, subjectCode, chapterId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('videos');

  const tabs = ['videos', 'notes', 'pyqs'];
  const videos = ['Introduction & Overview','Core Concepts Deep Dive','Problem Solving Session','Exam-Focused Revision'];
  const notes = ['Complete Chapter Notes (PDF)','Short Revision Notes (2 pages)','Formula & Concept Sheet','Hand-drawn Mind Map'];
  const pyqs = ['Mid-Term 2024','End-Term 2024','End-Term 2023','End-Term 2022','End-Term 2021'];

  return (
    <div className="max-w-4xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/academics')}>← Academics</button>

      <div className="mb-6">
        <div className="font-mono text-xs text-white/30 mb-1">{subjectCode} / Unit {parseInt(chapterId)+1}</div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight mb-1">Chapter {parseInt(chapterId)+1}</h1>
        <p className="text-sm text-white/40">{courseId?.toUpperCase()} · {subjectCode}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-2 border border-white/[0.06] rounded-2xl p-1 mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize ${activeTab === t ? 'bg-bg-4 text-white' : 'text-white/40 hover:text-white'}`}>
            {t === 'videos' ? '🎬 Videos' : t === 'notes' ? '📄 Notes' : '📝 PYQs'}
          </button>
        ))}
      </div>

      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((v, i) => (
            <div key={i} onClick={() => showToast('Opening video…')}
              className="bg-bg-2 border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer hover:border-white/10 hover:-translate-y-0.5 transition-all">
              <div className="h-36 bg-bg-3 flex items-center justify-center relative">
                <span className="text-5xl">🎬</span>
                <div className="absolute bottom-3 right-3 w-9 h-9 bg-brand rounded-full flex items-center justify-center text-sm text-white">▶</div>
              </div>
              <div className="p-3">
                <div className="text-sm font-medium mb-0.5">{v}</div>
                <div className="text-xs text-white/30">Lecture {i+1} · {20+i*8} min · Prof. Kumar</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="flex flex-col gap-2">
          {notes.map((n, i) => (
            <div key={i} onClick={() => showToast('Downloading…')}
              className="bg-bg-2 border border-white/[0.06] rounded-xl px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-bg-3 transition-colors">
              <span className="text-xl">📄</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{n}</div>
                <div className="text-xs text-white/30">{['18 pages','2 pages','1 page','1 page'][i]} · PDF</div>
              </div>
              <button className="text-xs bg-bg-4 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-bg-5 transition-colors">⬇ Download</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pyqs' && (
        <div className="flex flex-col gap-2">
          {pyqs.map((p, i) => (
            <div key={i} onClick={() => showToast('Opening PYQ…')}
              className="bg-bg-2 border border-white/[0.06] rounded-xl px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-bg-3 transition-colors">
              <span className="text-xl">📝</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{p}</div>
                <div className="text-xs text-white/30">{[10,15,15,15,12][i]} Questions · With Solutions</div>
              </div>
              <button className="text-xs bg-bg-4 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-bg-5 transition-colors">View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
