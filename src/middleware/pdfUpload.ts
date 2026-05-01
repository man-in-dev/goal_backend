import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CustomError } from './errorHandler';

// Get the absolute path for uploads directory
const backendRoot = path.resolve(__dirname, '..', '..');
const uploadsPath = path.resolve(backendRoot, 'uploads', 'pdfs');

// Ensure directory exists
if (!fs.existsSync(uploadsPath)) {
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
  } catch (error) {
    console.error(`Failed to create uploads directory: ${uploadsPath}`, error);
  }
}

const getUploadsPath = () => {
  if (!fs.existsSync(uploadsPath)) {
    try {
      fs.mkdirSync(uploadsPath, { recursive: true });
    } catch (error) {
      console.error(`Failed to create uploads directory: ${uploadsPath}`, error);
      throw error;
    }
  }
  return uploadsPath;
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadsPath());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `pdf-${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter (PDF and Images)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new CustomError('Only PDF documents and images are allowed', 400));
  }
};

// Configure multer (25MB limit)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
    files: 1
  }
});

export const uploadPdf = upload.single('pdf');

// Error handling middleware
export const handlePdfUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 25MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 1 file per upload.'
      });
    }
  }

  next(error);
};
