import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
  toggleBlogFeatured,
  getFeaturedBlogs,
  getRecentBlogs,
  getBlogsByCategory,
  getBlogsByTags,
  getPopularBlogs,
  getBlogStats
} from '../controllers/blogController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const blogValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional().isString().isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  body('featuredImage').optional().isURL().withMessage('Please provide a valid image URL'),
  body('imageAlt').optional().isString().isLength({ max: 200 }).withMessage('Image alt text cannot exceed 200 characters'),
  body('author').notEmpty().withMessage('Author is required').isLength({ max: 100 }).withMessage('Author name cannot exceed 100 characters'),
  body('category').isIn(['education', 'career', 'technology', 'lifestyle', 'general']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('publishDate').optional().isISO8601().withMessage('Please provide a valid publish date'),
  body('metaTitle').optional().isString().isLength({ max: 60 }).withMessage('Meta title cannot exceed 60 characters'),
  body('metaDescription').optional().isString().isLength({ max: 160 }).withMessage('Meta description cannot exceed 160 characters'),
  body('seoKeywords').optional().isArray().withMessage('SEO keywords must be an array'),
  body('createdBy').notEmpty().withMessage('Created by is required')
];

// Public routes
router.get('/', getAllBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/recent', getRecentBlogs);
router.get('/category', getBlogsByCategory);
router.get('/tags', getBlogsByTags);
router.get('/popular', getPopularBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Protected routes (for admin dashboard)
router.use(authenticateToken);
router.get('/stats', getBlogStats);
router.get('/:id', getBlogById);
// router.post('/', blogValidation, validateRequest, createBlog);
router.post('/', createBlog);
// router.put('/:id', blogValidation, validateRequest, updateBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id/toggle-publish', toggleBlogPublish);
router.patch('/:id/toggle-featured', toggleBlogFeatured);

export default router;
