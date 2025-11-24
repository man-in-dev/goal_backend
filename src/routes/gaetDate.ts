import express from 'express';
import { body } from 'express-validator';
import {
  getAllGAETDates,
  getGAETDateById,
  createGAETDate,
  updateGAETDate,
  deleteGAETDate,
} from '../controllers/gaetDateController';
import { protect, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation rules
const gaetDateValidation = [
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Date is required'),
  body('mode')
    .trim()
    .notEmpty()
    .withMessage('Mode is required'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

// Public routes
router.get('/', getAllGAETDates);
router.get('/:id', getGAETDateById);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createGAETDate);
router.put('/:id', protect, authorize('admin'), updateGAETDate);
router.delete('/:id', protect, authorize('admin'), deleteGAETDate);

export default router;

