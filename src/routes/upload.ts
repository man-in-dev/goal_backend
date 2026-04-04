import express from 'express';
import {
  uploadPdfController,
  getPdfsController,
  deletePdfController
} from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protected routes (authenticated users only)
router.use(authenticateToken);

router.post('/pdf', uploadPdfController);
router.get('/pdfs', getPdfsController);
router.delete('/pdfs/:id', deletePdfController);

export default router;