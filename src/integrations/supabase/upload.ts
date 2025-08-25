import { supabase } from './client';

export type UploadResult = {
  path: string;
  publicUrl: string;
};

// Upload a file to Supabase Storage and return its public URL
// Ensure the bucket exists and is public (e.g., create a bucket named "public" in your Supabase project)
export async function uploadFileToBucket(
  file: File,
  options: { bucket?: string; folder?: string } = {}
): Promise<UploadResult> {
  const bucket = options.bucket || 'public';
  const folder = (options.folder || 'uploads').replace(/^\/+|\/+$/g, '');

  const fileExt = file.name.split('.').pop() || 'bin';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const path = `${folder}/${unique}_${safeName}.${fileExt}`.replace(/\.+\./, '.');

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}


