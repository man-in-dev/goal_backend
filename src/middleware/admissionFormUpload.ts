import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CustomError } from './errorHandler';

// Get the absolute path for uploads directory
// In compiled code, __dirname will be: backend/dist/middleware
// So we need to go up two levels to get to backend root
const backendRoot = path.resolve(__dirname, '..', '..');
const uploadsPath = path.resolve(backendRoot, 'uploads', 'admission-forms');

// Ensure directory exists at module load time
if (!fs.existsSync(uploadsPath)) {
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log(`Created uploads directory: ${uploadsPath}`);
  } catch (error) {
    console.error(`Failed to create uploads directory: ${uploadsPath}`, error);
  }
}

const getUploadsPath = () => {
  // Double-check directory exists (in case it was deleted)
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

// Configure storage for admission form file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsPath = getUploadsPath();
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `admission-${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter to only allow images and PDFs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new CustomError('Only JPG, PNG images and PDF documents are allowed', 400));
  }
};

// Configure multer for admission form uploads
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
    files: 4 // Maximum 4 files (passport photo, report card, birth certificate, ID proof)
  }
});

// Middleware for handling single file upload (passport photo)
export const uploadPassportPhoto = upload.single('passportPhoto');

// Middleware for handling multiple file uploads
export const uploadAdmissionDocuments = upload.fields([
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'reportCard', maxCount: 1 },
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]);

// Error handling middleware for multer errors
export const handleAdmissionUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 2MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 4 files per upload.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Please use the correct field names.'
      });
    }
  }
  
  next(error);
};

