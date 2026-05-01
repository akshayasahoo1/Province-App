// ============================================
// ProvinceApp — Supabase Client (Frontend)
// Used for: real-time chat, auth, file uploads
// ============================================
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Real-time chat subscription helper
export const subscribeToChat = (instId, callback) => {
  return supabase
    .channel(`chat-${instId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `inst_id=eq.${instId}`
    }, callback)
    .subscribe();
};

// Upload file to Supabase Storage
export const uploadFile = async (file, bucket, path) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
};
