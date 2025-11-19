import express from 'express';
import { body } from 'express-validator';
import {
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import { protect, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation rules
const courseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .isIn(['Medical Courses', 'Engineering Courses', 'Pre-Foundation Course'])
    .withMessage('Category must be one of: Medical Courses, Engineering Courses, Pre-Foundation Course'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Icon cannot exceed 100 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/slug/:slug', getCourseBySlug);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), courseValidation, validateRequest, createCourse);
router.put('/:id', protect, authorize('admin'), courseValidation, validateRequest, updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

export default router;

