import express from 'express';
import { body } from 'express-validator';
import {
  getAllPublicNotices,
  getPublicNoticeById,
  createPublicNotice,
  updatePublicNotice,
  deletePublicNotice,
  getPublicNoticeStats
} from '../controllers/publicNoticeController';
import { protect, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation rules
const publicNoticeValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot be more than 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot be more than 2000 characters'),
  body('publishDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid publish date'),
  body('downloadLink')
    .optional()
    .isURL()
    .withMessage('Please provide a valid download link'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('category')
    .optional()
    .isIn(['exam', 'admission', 'general', 'academic', 'other'])
    .withMessage('Category must be exam, admission, general, academic, or other'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each tag must be a string')
];

// Public routes
router.get('/', getAllPublicNotices);
router.get('/stats', protect, authorize('admin', 'event_publisher'), getPublicNoticeStats);
router.get('/:id', getPublicNoticeById);

// Protected routes (Admin + Event Publisher)
// router.post('/', protect, authorize('admin', 'event_publisher'), publicNoticeValidation, validateRequest, createPublicNotice);
router.post('/', protect, authorize('admin', 'event_publisher'), createPublicNotice);
router.put('/:id', protect, authorize('admin', 'event_publisher'), updatePublicNotice);
// router.put('/:id', protect, authorize('admin', 'event_publisher'), publicNoticeValidation, validateRequest, updatePublicNotice);
router.delete('/:id', protect, authorize('admin', 'event_publisher'), deletePublicNotice);

export default router;

