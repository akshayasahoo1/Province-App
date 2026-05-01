// ============================================
// ProvinceApp — Global State (Zustand)
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ===== AUTH STORE =====
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      institution: 'lpu',

      setAuth: (user, token) => {
        localStorage.setItem('province_token', token);
        set({ user, token });
      },

      setInstitution: (inst) => set({ institution: inst }),

      logout: () => {
        localStorage.removeItem('province_token');
        localStorage.removeItem('province_user');
        set({ user: null, token: null });
      },

      isLoggedIn: () => !!get().token,
    }),
    {
      name: 'province_auth',
      partialize: (state) => ({ user: state.user, token: state.token, institution: state.institution }),
    }
  )
);

// ===== CART STORE =====
export const useCartStore = create((set, get) => ({
  items: [],
  restaurantId: null,

  addItem: (item, restaurantId) => {
    const { restaurantId: currentRest } = get();
    // Clear cart if switching restaurants
    if (currentRest && currentRest !== restaurantId) {
      if (!confirm('Your cart has items from another restaurant. Clear and add this item?')) return;
      set({ items: [], restaurantId: null });
    }
    set((state) => ({
      items: [...state.items, { ...item, cartId: Date.now() }],
      restaurantId,
    }));
  },

  removeItem: (cartId) => set((state) => ({
    items: state.items.filter((i) => i.cartId !== cartId),
  })),

  clearCart: () => set({ items: [], restaurantId: null }),

  total: () => get().items.reduce((sum, i) => sum + i.price, 0),
  count: () => get().items.length,
}));

// ===== UI STORE =====
export const useUIStore = create((set) => ({
  toast: null,
  showToast: (message, type = 'default') => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => set({ toast: null }), 2500);
  },
}));
