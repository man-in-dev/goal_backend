import { Router } from 'express';
import {
  submitEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  getEnquiryStats,
  deleteEnquiry
} from '../controllers/admissionController';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/enquiry', submitEnquiry);

// Protected routes (Admin only)
router.get('/enquiries', protect, getAllEnquiries);
router.get('/enquiries/:id', protect, getEnquiryById);
router.patch('/enquiries/:id/status', protect, updateEnquiryStatus);
router.get('/stats', protect, getEnquiryStats);
router.delete('/enquiries/:id', protect, deleteEnquiry);

export default router; 