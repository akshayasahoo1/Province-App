// ============================================
// PAGE: Restaurant Menu
// ============================================
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { restaurantAPI } from '../lib/api';
import { useCartStore, useUIStore } from '../store';

// Fallback menus by restaurant id
const STATIC_MENUS = {
  'punjabi-dhaba': {
    restaurant: { name:'Punjabi Dhaba', emoji:'🍛', location:'Block 34, Ground Floor', rating:4.3, rating_count:892, open:true, cover_color:'#1C0A00' },
    categories: {
      'Dal & Sabzi': [
        { id:'pd1', name:'Dal Makhni', description:'Slow-cooked black lentils, butter, cream', price:80, veg:true, emoji:'🫕', popular:true },
        { id:'pd2', name:'Paneer Butter Masala', description:'Rich tomato-cream gravy', price:120, veg:true, emoji:'🧀', popular:true },
        { id:'pd3', name:'Aloo Gobhi', description:'Potato & cauliflower', price:70, veg:true, emoji:'🥦' },
        { id:'pd4', name:'Chicken Curry', description:'Home-style Punjabi chicken', price:140, veg:false, emoji:'🍗' },
      ],
      'Breads & Rice': [
        { id:'pd5', name:'Butter Roti (2)', description:'Tandoor-fresh with white butter', price:30, veg:true, emoji:'🫓' },
        { id:'pd6', name:'Jeera Rice', description:'Fragrant cumin basmati', price:60, veg:true, emoji:'🍚' },
        { id:'pd7', name:'Aloo Paratha', description:'Stuffed spiced potato, curd on side', price:55, veg:true, emoji:'🥙', popular:true },
      ],
      'Thali': [
        { id:'pd8', name:'Veg Thali', description:'Dal + Sabzi + 3 Roti + Rice + Salad + Curd', price:110, veg:true, emoji:'🍱', popular:true },
        { id:'pd9', name:'Non-Veg Thali', description:'Chicken + Dal + 3 Roti + Rice', price:160, veg:false, emoji:'🍱' },
      ],
      'Drinks': [
        { id:'pd10', name:'Sweet Lassi', description:'Thick Punjabi curd lassi', price:40, veg:true, emoji:'🥛' },
        { id:'pd11', name:'Masala Chaas', description:'Spiced buttermilk', price:25, veg:true, emoji:'🥛' },
      ],
    }
  },
  'pizza-point': {
    restaurant: { name:'Pizza Point', emoji:'🍕', location:'Main Market, Block 38', rating:4.1, rating_count:534, open:true, cover_color:'#120018' },
    categories: {
      'Pizzas': [
        { id:'pp1', name:'Margherita 8"', description:'Classic tomato sauce, mozzarella', price:149, veg:true, emoji:'🍕' },
        { id:'pp2', name:'Paneer Tikka 10"', description:'Spiced paneer, peppers, onions', price:219, veg:true, emoji:'🍕', popular:true },
        { id:'pp3', name:'Chicken BBQ 10"', description:'Smoky BBQ chicken', price:249, veg:false, emoji:'🍕', popular:true },
        { id:'pp4', name:'Veg Supreme 12"', description:'7 toppings loaded', price:299, veg:true, emoji:'🍕' },
      ],
      'Sides': [
        { id:'pp5', name:'Garlic Bread (4)', description:'Toasted, herb butter, cheesy dip', price:79, veg:true, emoji:'🥖', popular:true },
        { id:'pp6', name:'Coke 500ml', description:'', price:35, veg:true, emoji:'🥤' },
      ],
    }
  },
  'south-bites': {
    restaurant: { name:'South Bites', emoji:'🥞', location:'Block 32 Food Court', rating:4.5, rating_count:1243, open:true, cover_color:'#00130A' },
    categories: {
      'Breakfast': [
        { id:'sb1', name:'Masala Dosa', description:'Crispy crepe, potato masala, chutneys', price:80, veg:true, emoji:'🥞', popular:true },
        { id:'sb2', name:'Idli Sambar (3)', description:'Soft steamed rice cakes', price:60, veg:true, emoji:'🍚', popular:true },
        { id:'sb3', name:'Rava Upma', description:'Semolina with veggies', price:50, veg:true, emoji:'🥣' },
        { id:'sb4', name:'Medu Vada (2)', description:'Crispy lentil donuts', price:55, veg:true, emoji:'🍩' },
      ],
      'Meals': [
        { id:'sb5', name:'South Indian Thali', description:'Rice, sambar, rasam, 2 curries, payasam', price:130, veg:true, emoji:'🍱', popular:true },
        { id:'sb6', name:'Curd Rice', description:'Cooling yoghurt rice', price:60, veg:true, emoji:'🍚' },
      ],
    }
  },
  'campus-cafe': {
    restaurant: { name:'Campus Café', emoji:'☕', location:'Library Block, Ground Floor', rating:4.2, rating_count:678, open:true, cover_color:'#100800' },
    categories: {
      'Hot Drinks': [
        { id:'cc1', name:'Masala Chai', description:'Ginger, cardamom, strong brew', price:25, veg:true, emoji:'☕', popular:true },
        { id:'cc2', name:'Cappuccino', description:'Double espresso, steamed foam', price:75, veg:true, emoji:'☕' },
        { id:'cc3', name:'Filter Coffee', description:'South Indian style', price:30, veg:true, emoji:'☕' },
      ],
      'Cold Drinks': [
        { id:'cc4', name:'Cold Coffee', description:'Iced, sweetened, whipped cream', price:80, veg:true, emoji:'🧋', popular:true },
        { id:'cc5', name:'Oreo Shake', description:'Blended oreo milkshake', price:95, veg:true, emoji:'🥤' },
      ],
      'Snacks': [
        { id:'cc6', name:'Maggi Masala', description:'Classic 2-minute noodles', price:40, veg:true, emoji:'🍜', popular:true },
        { id:'cc7', name:'Veg Sandwich', description:'Toasted, chutney, veggies', price:55, veg:true, emoji:'🥪' },
        { id:'cc8', name:'Samosa (2)', description:'Crispy with chutney', price:30, veg:true, emoji:'🥟' },
      ],
    }
  },
  'chole-king': {
    restaurant: { name:'Chole Bhature King', emoji:'🫓', location:'Law Gate, Opp. Gate 2', rating:4.7, rating_count:2341, open:true, cover_color:'#0F0800' },
    categories: {
      'Main': [
        { id:'ck1', name:'Chole Bhature (2)', description:'Spicy Punjabi chole, fluffy bhature', price:70, veg:true, emoji:'🫓', popular:true },
        { id:'ck2', name:'Chole Kulche', description:'Amritsari kulche, spiced chole', price:65, veg:true, emoji:'🥙', popular:true },
      ],
      'Drinks': [
        { id:'ck3', name:'Sweet Lassi', description:'Thick Punjabi lassi', price:40, veg:true, emoji:'🥛', popular:true },
        { id:'ck4', name:'Nimbu Pani', description:'Fresh lemon water', price:20, veg:true, emoji:'🍋' },
      ],
    }
  },
};

export default function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items, total, count, clearCart } = useCartStore();
  const { showToast } = useUIStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restaurantAPI.getById(id)
      .then(r => setData(r.data))
      .catch(() => setData(STATIC_MENUS[id] || null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64 text-white/30">Loading menu…</div>;
  if (!data) return <div className="flex items-center justify-center h-64 text-white/30">Restaurant not found</div>;

  const { restaurant: r, categories } = data;

  return (
    <div className="max-w-3xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors"
        onClick={() => navigate('/restaurants')}>← Restaurants</button>

      {/* Hero */}
      <div className="bg-bg-2 border border-white/[0.06] rounded-2xl p-5 mb-6 flex gap-5 items-center">
        <span style={{ fontSize: 52 }}>{r.emoji}</span>
        <div>
          <h1 className="font-display text-xl font-extrabold mb-1">{r.name}</h1>
          <div className="flex flex-wrap gap-3 text-xs text-white/40">
            <span className="text-yellow-400 font-semibold">★ {r.rating}</span>
            <span>({r.rating_count} reviews)</span>
            <span>📍 {r.location}</span>
            <span className={`font-semibold ${r.open ? 'text-green-400' : 'text-red-400'}`}>
              ● {r.open ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      {Object.entries(categories).map(([catName, items]) => (
        <div key={catName} className="mb-8">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-brand border-b border-white/[0.06] pb-2 mb-2">
            {catName}
          </div>
          <div className="flex flex-col gap-0.5">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-bg-3 transition-colors">
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {/* Veg/NonVeg indicator */}
                    <span className={`w-3 h-3 rounded-[2px] border flex items-center justify-center shrink-0 ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    {item.name}
                    {item.popular && (
                      <span className="text-[9px] font-bold uppercase tracking-wide bg-brand/10 text-brand px-1.5 py-0.5 rounded-full">Popular</span>
                    )}
                  </div>
                  {item.description && (
                    <div className="text-xs text-white/30 mt-0.5 truncate">{item.description}</div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold">₹{item.price}</span>
                  <button
                    onClick={() => { addItem(item, id); showToast(`${item.name} added! 🛒`); }}
                    className="bg-brand/10 border border-brand/25 text-brand text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-all">
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Cart float */}
      {count() > 0 && (
        <div className="fixed bottom-24 right-5 bg-brand rounded-full px-5 py-3 flex items-center gap-3 shadow-[0_4px_24px_rgba(255,69,0,0.35)] cursor-pointer hover:scale-105 transition-transform z-50"
          onClick={() => showToast(`Total: ₹${total()} · Checkout coming soon!`)}>
          <span className="text-white text-sm font-semibold">🛒 View Cart</span>
          <span className="w-6 h-6 bg-white text-brand text-xs font-bold rounded-full flex items-center justify-center">{count()}</span>
        </div>
      )}
    </div>
  );
}
