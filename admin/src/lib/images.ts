import { supabase } from './supabase';
import { env } from './env';

export const BUCKET = 'site-images';
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_DIMENSION = 2000;

/**
 * URL usable in an <img> for a stored image value (img/… path or absolute
 * URL). With `width`, Unsplash images are requested at that size.
 */
export function imagePreviewUrl(value: string, width?: number): string {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) {
    if (width && /^https:\/\/images\.unsplash\.com\//.test(value)) {
      const url = new URL(value);
      url.searchParams.set('w', String(width));
      return url.toString();
    }
    return value;
  }
  return `${env.siteUrl}/${value.split('/').map(encodeURIComponent).join('/')}`;
}

/** Same rule as the database (public.is_safe_image), for instant feedback. */
export function isAcceptableImage(value: string): boolean {
  if (/^https:\/\/[^\s"'<>]+$/.test(value)) return true;
  if (/^img\/[^"<>]+$/.test(value) && !value.includes('..') && !/[\\\n\r]/.test(value)) return true;
  return /^http:\/\/(127\.0\.0\.1|localhost):54321\/storage\/v1\/object\/public\/site-images\/[A-Za-z0-9/_.-]+$/.test(value);
}

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return 'Format accepté : JPEG, PNG ou WebP.';
  if (file.size > MAX_UPLOAD_BYTES) return 'Image trop lourde (8 Mo maximum).';
  return null;
}

/**
 * Re-encodes the image in the browser: max 2000 px, WebP. Re-encoding
 * through a canvas also drops all metadata (EXIF, GPS position…).
 */
export async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Traitement de l’image impossible dans ce navigateur.');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
  if (!blob) throw new Error('Conversion de l’image impossible.');
  return blob;
}

/** Uploads to the site-images bucket and returns the public URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const problem = validateFile(file);
  if (problem) throw new Error(problem);
  const blob = await prepareImage(file);
  const safeFolder = folder.replace(/[^a-z0-9_-]/gi, '') || 'divers';
  const path = `${safeFolder}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
