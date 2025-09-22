import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function configureCloudinaryFromEnv() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('[Cloudinary] CLOUDINARY_CLOUD_NAME not set. Image uploads will be skipped.');
    return null;
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

// Local fallback: save to backend/uploads and return a URL under /uploads
function saveLocal(buffer, folder = 'sheharfix') {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Save to backend/uploads/<folder>
    const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads', folder);
    fs.mkdirSync(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);
    const urlPath = `/uploads/${folder}/${filename}`;
    console.warn('[Cloudinary] Using local upload fallback:', urlPath);
    return { secure_url: urlPath };
  } catch (e) {
    console.error('[Cloudinary] Local fallback failed:', e);
    return null;
  }
}

export async function uploadBuffer(buffer, folder = 'sheharfix') {
  const cl = configureCloudinaryFromEnv();
  if (!cl) {
    return saveLocal(buffer, folder);
  }
  try {
    return await new Promise((resolve, reject) => {
      const stream = cl.uploader.upload_stream({ folder }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(buffer);
    });
  } catch (err) {
    console.warn('[Cloudinary] Upload failed, falling back to local storage:', err?.message || err);
    return saveLocal(buffer, folder);
  }
}
