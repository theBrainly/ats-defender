import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import CloudinaryStoragePkg from 'multer-storage-cloudinary';
const { CloudinaryStorage } = CloudinaryStoragePkg;
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ats-defender/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 300, height: 300, crop: 'fill', gravity: 'face' }
    ],
    public_id: (req, file) => {
      // Create unique filename with user ID, ensuring no whitespace
      const userId = req.user?.id ? req.user.id.toString().trim() : 'anonymous';
      // Remove any potential whitespace from the result just in case
      return `avatar_${userId}_${Date.now()}`.replace(/\s+/g, '');
    },
  },
});

// Create multer upload middleware
export const uploadAvatar = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

export { cloudinary };
