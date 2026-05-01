// ============================================
// ProvinceApp — Reusable Components
// ============================================

// Toast.jsx
import { useUIStore } from '../store';
export default function Toast() {
  const toast = useUIStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9000] bg-bg-4 border border-white/10 text-white text-sm px-5 py-2.5 rounded-full shadow-2xl whitespace-nowrap animate-fade-in">
      {toast.message}
    </div>
  );
}
