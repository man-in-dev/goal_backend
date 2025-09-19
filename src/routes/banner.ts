import express from 'express';
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  getActiveBannersByPosition,
  recordBannerClick,
  recordBannerImpression,
  getBannerStats
} from '../controllers/bannerController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const bannerValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').optional().isString().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('imageUrl').notEmpty().withMessage('Image URL is required'),
  body('imageAlt').notEmpty().withMessage('Image alt text is required').isLength({ max: 200 }).withMessage('Alt text cannot exceed 200 characters'),
  body('mobileImageUrl').optional().isString().withMessage('Mobile image URL must be a string'),
  body('mobileImageAlt').optional().isString().isLength({ max: 200 }).withMessage('Mobile alt text cannot exceed 200 characters'),
  body('linkUrl').optional().isURL().withMessage('Please provide a valid URL'),
  body('position').isIn(['hero', 'sidebar', 'footer', 'popup', 'announcement']).withMessage('Invalid position'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('priority').optional().isInt({ min: 0, max: 100 }).withMessage('Priority must be between 0 and 100'),
  body('targetAudience').optional().isArray().withMessage('Target audience must be an array'),
  body('createdBy').notEmpty().withMessage('Created by is required')
];

// Public routes
router.get('/active/:position', getActiveBannersByPosition);
router.post('/:id/click', recordBannerClick);
router.post('/:id/impression', recordBannerImpression);

// Protected routes (for admin dashboard)
router.use(authenticateToken);
router.get('/', getAllBanners);
router.get('/stats', getBannerStats);
router.get('/:id', getBannerById);
// router.post('/', bannerValidation, validateRequest, createBanner);
router.post('/', createBanner);
router.put('/:id', bannerValidation, validateRequest, updateBanner);
router.delete('/:id', deleteBanner);
router.patch('/:id/toggle-status', toggleBannerStatus);

export default router;
