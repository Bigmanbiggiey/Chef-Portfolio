import { supabase } from '../supabase';

export const MEDIA_BUCKET = 'site-media';
const DEFAULT_MAX_DIM = 1600;
const JPEG_QUALITY = 0.82;

export function publicUrlFor(path) {
  if (!path) return null;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

// Downscales/recompresses an upload in the browser before it reaches storage —
// phone-camera photos are routinely 3000px+ wide, far larger than any card or
// hero image on the site ever displays, which is what made the bundled assets
// slow on mobile in the first place. Falls back to the original file if the
// browser can't decode it (e.g. HEIC) or it's already within bounds.
async function resizeForUpload(file, maxDim) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  if (scale === 1) {
    bitmap.close?.();
    return file;
  }

  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const isPng = file.type === 'image/png';
  const mimeType = isPng ? 'image/png' : 'image/jpeg';
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, mimeType, isPng ? undefined : JPEG_QUALITY)
  );
  if (!blob) return file;

  const ext = isPng ? 'png' : 'jpg';
  const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
  return new File([blob], name, { type: mimeType });
}

export async function uploadImage(folder, file, { maxDim = DEFAULT_MAX_DIM } = {}) {
  const upload = await resizeForUpload(file, maxDim);
  const path = `${folder}/${Date.now()}-${upload.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, upload);
  if (error) throw error;
  return path;
}

export async function deleteImage(path) {
  if (!path) return;
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}
