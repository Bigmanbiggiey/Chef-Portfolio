import { supabase } from '../supabase';

export const MEDIA_BUCKET = 'site-media';

export function publicUrlFor(path) {
  if (!path) return null;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadImage(folder, file) {
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file);
  if (error) throw error;
  return path;
}

export async function deleteImage(path) {
  if (!path) return;
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}
