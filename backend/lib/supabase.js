// ============================================
// ProvinceApp — Supabase Client (Backend)
// ============================================
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // service key for backend (full access)
);

module.exports = supabase;
