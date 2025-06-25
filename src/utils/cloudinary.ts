const CLOUDINARY_CLOUD_NAME =
  (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME ||
  (typeof process !== 'undefined' ? process.env.CLOUDINARY_CLOUD_NAME : '');
const CLOUDINARY_UPLOAD_PRESET =
  (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET ||
  (typeof process !== 'undefined' ? process.env.CLOUDINARY_UPLOAD_PRESET : '');

export async function uploadImage(
  file: File,
  folder?: string,
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  if (CLOUDINARY_UPLOAD_PRESET) formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  if (folder) formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.secure_url as string;
}

export function transformImage(
  url: string,
  options: { width?: number; height?: number; crop?: string } = {},
): string {
  const params = [] as string[];
  if (options.width) params.push(`w_${options.width}`);
  if (options.height) params.push(`h_${options.height}`);
  if (options.crop) params.push(`c_${options.crop}`);
  if (params.length === 0) return url;
  const transformation = params.join(',');
  return url.replace('/upload/', `/upload/${transformation}/`);
}
