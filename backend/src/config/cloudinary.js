import { v2 as cloudinary } from 'cloudinary';

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

export async function uploadBuffer(buffer, folder = 'sheharfix') {
  const cl = configureCloudinaryFromEnv();
  if (!cl) return null;
  return new Promise((resolve, reject) => {
    const stream = cl.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}
