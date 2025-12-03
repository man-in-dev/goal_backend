import express from 'express';
import {
  getAllNewsEvents,
  getNewsEventById,
  createNewsEvent,
  updateNewsEvent,
  deleteNewsEvent,
  getRecentNewsEvents,
  getNewsEventsByTags,
  getNewsEventStats,
  toggleNewsEventLike,
  incrementNewsEventShare
} from '../controllers/newsEventController';
import { protect, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules for creating
const createNewsEventValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  body('type').isIn(['news', 'event', 'announcement', 'achievement']).withMessage('Invalid type'),
  body('category').isIn(['academic', 'sports', 'cultural', 'achievement', 'general']).withMessage('Invalid category'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('publishDate').optional().isISO8601().withMessage('Please provide a valid publish date'),
  body('publishTime').optional().isString().withMessage('Publish time must be a string'),
  body('location').optional().isString().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
  body('expiryDate').optional().isISO8601().withMessage('Please provide a valid expiry date'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('likes').optional().isInt({ min: 0 }).withMessage('Likes must be a non-negative integer'),
  body('shares').optional().isInt({ min: 0 }).withMessage('Shares must be a non-negative integer'),
  body('metaTitle').optional().isLength({ max: 200 }).withMessage('Meta title cannot exceed 200 characters'),
  body('metaDescription').optional().isLength({ max: 300 }).withMessage('Meta description cannot exceed 300 characters'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('createdBy').notEmpty().withMessage('Created by is required')
];

// Validation rules for updating
const updateNewsEventValidation = [
  body('title').optional().isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('content').optional(),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  body('type').optional().isIn(['news', 'event', 'announcement', 'achievement']).withMessage('Invalid type'),
  body('category').optional().isIn(['academic', 'sports', 'cultural', 'achievement', 'general']).withMessage('Invalid category'),
  body('author').optional(),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('publishDate').optional().isISO8601().withMessage('Please provide a valid publish date'),
  body('publishTime').optional().isString().withMessage('Publish time must be a string'),
  body('location').optional().isString().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
  body('expiryDate').optional().isISO8601().withMessage('Please provide a valid expiry date'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('likes').optional().isInt({ min: 0 }).withMessage('Likes must be a non-negative integer'),
  body('shares').optional().isInt({ min: 0 }).withMessage('Shares must be a non-negative integer'),
  body('metaTitle').optional().isLength({ max: 200 }).withMessage('Meta title cannot exceed 200 characters'),
  body('metaDescription').optional().isLength({ max: 300 }).withMessage('Meta description cannot exceed 300 characters'),
  body('slug').optional()
];

// Public routes
router.get('/', getAllNewsEvents);
router.get('/recent', getRecentNewsEvents);
router.get('/tags', getNewsEventsByTags);
router.post('/:id/like', toggleNewsEventLike);
router.post('/:id/share', incrementNewsEventShare);

// Protected routes (for admin dashboard)
// Only admin and event_publisher roles can manage news & events
router.use(protect, authorize('admin', 'event_publisher'));
router.get('/stats', getNewsEventStats);
router.get('/:id', getNewsEventById);
// router.post('/', createNewsEventValidation, validateRequest, createNewsEvent);
router.post('/', createNewsEvent);
// router.put('/:id', updateNewsEventValidation, validateRequest, updateNewsEvent);
router.put('/:id', updateNewsEvent);
router.delete('/:id', deleteNewsEvent);

export default router;
