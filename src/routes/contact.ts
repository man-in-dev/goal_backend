import { Router } from 'express';
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  getContactStats,
  deleteContact
} from '../controllers/contactController';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/submit', submitContact);

// Protected routes (Admin only)
router.get('/forms', protect, getAllContacts);
router.get('/forms/:id', protect, getContactById);
router.patch('/forms/:id/status', protect, updateContactStatus);
router.get('/stats', protect, getContactStats);
router.delete('/forms/:id', protect, deleteContact);

export default router;
