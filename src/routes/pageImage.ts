import express from 'express';
import {
  getAllPageImages,
  createPageImage,
  updatePageImage,
  deletePageImage,
  togglePageImageStatus,
  getActiveImagesByPage
} from '../controllers/pageImageController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/active/:page', getActiveImagesByPage);

// Protected routes (for admin dashboard)
router.use(authenticateToken);
router.get('/', getAllPageImages);
router.post('/', createPageImage);
router.put('/:id', updatePageImage);
router.delete('/:id', deletePageImage);
router.patch('/:id/toggle-status', togglePageImageStatus);

export default router;
