import express from 'express';
import {
  submitRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  deleteRegistration,
  getStats
} from '../controllers/summerCampController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/submit', submitRegistration);

// Protected routes (Admin only)
router.use(authenticateToken);

router.get('/', getAllRegistrations);
router.get('/stats', getStats);
router.get('/:id', getRegistrationById);
router.patch('/:id/status', updateRegistrationStatus);
router.delete('/:id', deleteRegistration);

export default router;
