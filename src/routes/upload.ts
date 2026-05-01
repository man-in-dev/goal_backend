import express from 'express';
import {
  uploadPdfController,
  uploadFileController,
  getPdfsController,
  deletePdfController
} from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';
import { uploadPdf, handlePdfUploadError } from '../middleware/pdfUpload';

const router = express.Router();

// Protected routes (authenticated users only)
router.use(authenticateToken);

// Upload actual PDF file (multipart/form-data) → saves to disk, returns URL
router.post('/file', uploadPdf, handlePdfUploadError, uploadFileController);

// Register PDF metadata (URL already exists from external storage)
router.post('/pdf', uploadPdfController);
router.get('/pdfs', getPdfsController);
router.delete('/pdfs/:id', deletePdfController);

export default router;