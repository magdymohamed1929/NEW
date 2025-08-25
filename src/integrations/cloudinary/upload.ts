export type CloudinaryUploadOptions = {
  folder?: string;
  uploadPreset?: string; // if provided, overrides env preset
  cloudName?: string; // if provided, overrides env cloud name
};

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
};

// Uploads a file to Cloudinary using an unsigned upload preset.
// Configure env vars:
//  - VITE_CLOUDINARY_CLOUD_NAME
//  - VITE_CLOUDINARY_UPLOAD_PRESET (unsigned)
export async function uploadToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const cloudName = options.cloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = options.uploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error('Missing Cloudinary config. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (options.folder) formData.append('folder', options.folder);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.status} ${text}`);
  }

  const json = await response.json();
  return { secureUrl: json.secure_url, publicId: json.public_id };
}


