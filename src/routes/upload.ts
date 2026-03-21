import express from 'express';
import { uploadPdfController } from '../controllers/uploadController';
import { uploadPdf, handlePdfUploadError } from '../middleware/pdfUpload';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protected route (authenticated users only)
router.post('/pdf', authenticateToken, uploadPdf, handlePdfUploadError, uploadPdfController);

export default router;
