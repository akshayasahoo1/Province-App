// ============================================
// PAGE: Academics
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COURSES = {
  cse: { name:'BTech CSE', emoji:'💻', color:'#3B82F6', semesters:[
    { sem:1, subjects:[
      { code:'CSE101', name:'Programming Fundamentals (C)', credits:4, chapters:['Intro to C & Program Structure','Data Types & Operators','Control Flow & Decisions','Loops & Iteration','Arrays & Strings','Functions & Recursion','Pointers & Memory','File I/O & Structures'] },
      { code:'MTH101', name:'Engineering Mathematics I', credits:4, chapters:['Sets, Relations & Functions','Differential Calculus','Integral Calculus','Differential Equations','Matrices & Determinants','Sequences & Series'] },
      { code:'PHY101', name:'Engineering Physics', credits:3, chapters:['Oscillations & Waves','Optics','Quantum Mechanics','Lasers','Fibre Optics','Semiconductors'] },
      { code:'DLD101', name:'Digital Logic Design', credits:4, chapters:['Number Systems','Boolean Algebra','Logic Gates','Combinational Circuits','Sequential Circuits','Counters & Registers'] },
    ]},
    { sem:2, subjects:[
      { code:'CSE201', name:'OOP with Java', credits:4, chapters:['OOP Concepts','Classes & Objects','Inheritance','Polymorphism','Exception Handling','Collections','Generics & Lambda','JavaFX'] },
      { code:'CSE202', name:'Data Structures', credits:4, chapters:['Arrays & Linked Lists','Stacks & Queues','Trees & BST','Heaps','Graphs (BFS, DFS)','Hashing','Sorting','Searching'] },
      { code:'MTH201', name:'Discrete Mathematics', credits:3, chapters:['Logic & Proof','Set Theory','Relations','Graph Theory','Trees','Combinatorics','Probability','Algebraic Structures'] },
      { code:'MTH202', name:'Engineering Mathematics II', credits:4, chapters:['Fourier Series','Laplace Transform','Z-Transform','PDEs','Complex Analysis','Numerical Methods'] },
    ]},
    { sem:3, subjects:[
      { code:'CSE301', name:'Design & Analysis of Algorithms', credits:4, chapters:['Algorithm Analysis (Big-O)','Divide & Conquer','Dynamic Programming','Greedy Algorithms','Graph Algorithms','Backtracking','NP-Completeness','Approximation'] },
      { code:'CSE302', name:'Computer Organization & Architecture', credits:4, chapters:['CPU Design','Memory Hierarchy','Cache Memory','Pipelining','I/O Systems','RISC vs CISC','Parallel Processors'] },
      { code:'CSE303', name:'Database Management Systems', credits:4, chapters:['ER Modeling','Relational Algebra','SQL','Normalization','Transactions & ACID','Concurrency Control','Query Optimization','NoSQL'] },
      { code:'CSE304', name:'Operating Systems', credits:4, chapters:['OS Concepts','Process Management','CPU Scheduling','Synchronization','Deadlock','Memory Management','Virtual Memory','File Systems'] },
    ]},
    { sem:4, subjects:[
      { code:'CSE401', name:'Computer Networks', credits:4, chapters:['OSI & TCP/IP','Physical Layer','Data Link Layer','Network Layer','Transport Layer','Application Protocols','Network Security','Wireless'] },
      { code:'CSE402', name:'Software Engineering', credits:3, chapters:['SDLC Models','Requirements','UML','Design Patterns','Testing','Code Review','DevOps & CI/CD','Project Management'] },
      { code:'CSE403', name:'Theory of Computation', credits:4, chapters:['Automata & DFA/NFA','Regular Languages','Context-Free Grammars','Pushdown Automata','Turing Machines','Decidability','Complexity Classes'] },
      { code:'CSE404', name:'Web Technologies', credits:3, chapters:['HTML5 & CSS3','JavaScript ES6+','React','Node.js & Express','REST APIs','Databases','Auth','Deployment'] },
    ]},
    { sem:5, subjects:[
      { code:'CSE501', name:'Machine Learning', credits:4, chapters:['ML Paradigms','Linear Regression','Decision Trees','SVM','Clustering','PCA','Neural Networks','Model Evaluation'] },
      { code:'CSE502', name:'Compiler Design', credits:4, chapters:['Compilation Phases','Lexical Analysis','Syntax Analysis','Parsers','Semantic Analysis','Intermediate Code','Optimization','Code Generation'] },
    ]},
  ]},
  mba: { name:'MBA', emoji:'📊', color:'#A855F7', semesters:[
    { sem:1, subjects:[
      { code:'MBA101', name:'Management Theory & Practice', credits:4, chapters:['Evolution of Management','Planning','Organizing','Leadership & Motivation','Control','Contemporary Issues'] },
      { code:'MBA102', name:'Financial Accounting', credits:4, chapters:['Accounting Principles','Journal & Ledger','Trial Balance','P&L Account','Balance Sheet','Cash Flow','Ratio Analysis','Statement Analysis'] },
      { code:'MBA103', name:'Marketing Management', credits:4, chapters:['Marketing Concepts','Consumer Behaviour','Market Research','Product Strategy','Pricing','Distribution','Communication','Digital Marketing'] },
    ]},
    { sem:2, subjects:[
      { code:'MBA201', name:'Financial Management', credits:4, chapters:['Time Value of Money','Capital Budgeting','Cost of Capital','Capital Structure','Working Capital','Dividend Policy','Risk & Return','Derivatives'] },
      { code:'MBA202', name:'Operations Management', credits:4, chapters:['Production Planning','Inventory Control','Quality Management','Supply Chain','Project Management','ERP','Lean & Agile'] },
    ]},
  ]},
  agriculture: { name:'BSc Agriculture', emoji:'🌾', color:'#22C55E', semesters:[
    { sem:1, subjects:[
      { code:'AGR101', name:'Fundamentals of Agronomy', credits:4, chapters:['Crop Classification','Soil-Plant-Water','Kharif Crops','Rabi Crops','Tillage & Sowing','Weed Management','Harvesting'] },
      { code:'AGR102', name:'Soil Science', credits:4, chapters:['Soil Formation','Physical Properties','Chemical Properties','Organic Matter','Soil Fertility','Fertilizers','Soil Conservation','Irrigation'] },
    ]},
  ]},
  bca: { name:'BCA', emoji:'🖥️', color:'#F59E0B', semesters:[
    { sem:1, subjects:[
      { code:'BCA101', name:'Programming in C', credits:4, chapters:['C Basics','Control Flow','Functions','Arrays & Strings','Pointers','File Handling','Structures'] },
      { code:'BCA102', name:'Mathematics for Computing', credits:3, chapters:['Logic & Boolean Algebra','Set Theory','Matrices','Probability','Calculus','Graph Theory'] },
    ]},
  ]},
  bcom: { name:'BCom', emoji:'💰', color:'#EF4444', semesters:[
    { sem:1, subjects:[
      { code:'COM101', name:'Financial Accounting', credits:4, chapters:['Accounting Concepts','Journal','Ledger','Trial Balance','Final Accounts','Bank Reconciliation','Depreciation','Bills of Exchange'] },
      { code:'COM102', name:'Business Economics', credits:3, chapters:['Demand & Supply','Elasticity','Consumer Behaviour','Production Theory','Cost Curves','Market Structures','GDP','Inflation'] },
    ]},
  ]},
};

export default function Academics() {
  const navigate = useNavigate();
  const [activeCourse, setActiveCourse] = useState('cse');
  const [openSubjects, setOpenSubjects] = useState({});
  const course = COURSES[activeCourse];

  const toggleSubject = (code) => setOpenSubjects(s => ({ ...s, [code]: !s[code] }));

  return (
    <div className="max-w-4xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">📚 Academics</h1>
      <p className="text-sm text-white/40 mb-6">Full syllabus, PYQs, notes & video lectures for all courses</p>

      {/* Course tabs */}
      <div className="flex gap-1 bg-bg-2 border border-white/[0.06] rounded-2xl p-1 mb-7 flex-wrap">
        {Object.entries(COURSES).map(([key, c]) => (
          <button key={key} onClick={() => setActiveCourse(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCourse === key ? 'bg-brand text-white' : 'text-white/40 hover:text-white'}`}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Semesters */}
      {course.semesters.map(sem => (
        <div key={sem.sem} className="mb-7">
          <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/30 mb-3">Semester {sem.sem}</div>
          <div className="flex flex-col gap-1">
            {sem.subjects.map(sub => (
              <div key={sub.code} className="bg-bg-2 border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-bg-3 transition-colors"
                  onClick={() => toggleSubject(sub.code)}>
                  <span className="font-mono text-[11px] text-brand bg-brand/8 px-2 py-1 rounded-lg shrink-0 w-20 text-center">{sub.code}</span>
                  <span className="flex-1 text-sm font-medium">{sub.name}</span>
                  <span className="text-xs text-white/30 shrink-0">{sub.credits} Cr</span>
                  <span className={`text-xs text-white/30 transition-transform ${openSubjects[sub.code] ? 'rotate-180' : ''}`}>▾</span>
                </div>
                {openSubjects[sub.code] && (
                  <div className="border-t border-white/[0.05] bg-bg">
                    {sub.chapters.map((ch, i) => (
                      <div key={i}
                        onClick={() => navigate(`/academics/${activeCourse}/${sub.code}/${i}`)}
                        className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-bg-2 cursor-pointer transition-colors">
                        <span className="font-mono text-[11px] text-white/30 w-14 shrink-0">Unit {i+1}</span>
                        <span className="flex-1 text-sm">{ch}</span>
                        <div className="flex gap-1.5 shrink-0">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400">▶ Video</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">📄 Notes</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400">📝 PYQ</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
