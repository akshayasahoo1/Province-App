import { useNavigate } from 'react-router-dom';
const VENDORS = [
  { emoji:'📎', name:'Campus Stationery & Xerox Hub', category:'Stationery', desc:'Notebooks, pens, A4 printing, lamination, spiral binding', hours:'8 AM – 9 PM', location:'Block 35, Ground Floor', rating:4.0 },
  { emoji:'📱', name:'Tech Zone — Mobiles & Accessories', category:'Electronics', desc:'Phone cases, chargers, earphones, laptop bags, RAM, SSDs', hours:'10 AM – 8 PM', location:'Market, Block 38', rating:3.8 },
  { emoji:'✂️', name:'Pro Cuts — Unisex Salon', category:'Services', desc:'Haircut, styling, shave, facial — student discounts', hours:'9 AM – 8 PM', location:'Block 36, Ground Floor', rating:4.4 },
  { emoji:'💊', name:'MedPlus Campus Pharmacy', category:'Pharmacy', desc:'Prescription & OTC medicines, first aid, vitamins — 24x7', hours:'24 Hours', location:'Block 17, Hospital Wing', rating:4.6 },
  { emoji:'📚', name:'Book Corner & Study Material', category:'Books', desc:'Textbooks (buy/sell/rent), reference books, solved PYQs', hours:'9 AM – 7 PM', location:'Library Block', rating:4.2 },
  { emoji:'👕', name:'LaundryWala — Pickup & Delivery', category:'Services', desc:'Wash + fold, dry cleaning, ironing — hostel room pickup', hours:'8 AM – 6 PM', location:'Near Block 55 Hostel', rating:4.1 },
];
export default function Vendors() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">🛍️ Campus Vendors</h1>
      <p className="text-sm text-white/40 mb-6">Shops, stationery, electronics & services on campus</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VENDORS.map(v => (
          <div key={v.name} className="bg-bg-2 border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 hover:-translate-y-0.5 transition-all">
            <div className="text-4xl mb-3">{v.emoji}</div>
            <div className="font-display text-base font-bold mb-1">{v.name}</div>
            <div className="text-xs text-white/30 mb-2">{v.category}</div>
            <div className="text-xs text-white/40 leading-relaxed mb-4">{v.desc}</div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/25">🕐 {v.hours}</span>
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">● Open</span>
            </div>
            <div className="text-xs text-white/25 mt-1.5">📍 {v.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
