import express from 'express';
import {
  getAllComplaintsFeedback,
  getComplaintFeedbackById,
  createComplaintFeedback,
  updateComplaintFeedback,
  deleteComplaintFeedback,
  getComplaintFeedbackStats
} from '../controllers/complaintFeedbackController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const complaintFeedbackValidation = [
  body('isGoalStudent').isBoolean().withMessage('Student type is required'),
  body('uid').custom((value, { req }) => {
    if (req.body.isGoalStudent && (!value || value.trim() === '')) {
      throw new Error('UID is required for Goal students');
    }
    if (value && value.length > 50) {
      throw new Error('UID cannot exceed 50 characters');
    }
    return true;
  }),
  body('rollNo').custom((value, { req }) => {
    if (req.body.isGoalStudent && (!value || value.trim() === '')) {
      throw new Error('Roll number is required for Goal students');
    }
    if (value && value.length > 20) {
      throw new Error('Roll number cannot exceed 20 characters');
    }
    return true;
  }),
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('course').custom((value, { req }) => {
    if (req.body.isGoalStudent && (!value || value.trim() === '')) {
      throw new Error('Course is required for Goal students');
    }
    if (value && value.length > 100) {
      throw new Error('Course cannot exceed 100 characters');
    }
    return true;
  }),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('type').isIn(['complaint', 'feedback', 'suggestion']).withMessage('Type must be complaint, feedback, or suggestion'),
  body('department').notEmpty().withMessage('Department is required').isLength({ max: 100 }).withMessage('Department cannot exceed 100 characters'),
  body('message').notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
  body('attachment').optional().isString().withMessage('Attachment must be a string'),
  body('attachmentAlt').optional().isString().isLength({ max: 200 }).withMessage('Attachment alt text cannot exceed 200 characters'),
  body('status').optional().isIn(['pending', 'in_review', 'resolved', 'closed']).withMessage('Invalid status')
];

// Public routes (for form submission)
router.post('/', createComplaintFeedback);
// router.post('/', complaintFeedbackValidation, validateRequest, createComplaintFeedback);

// Protected routes (for admin dashboard)
router.use(authenticateToken);

router.get('/', getAllComplaintsFeedback);
router.get('/stats', getComplaintFeedbackStats);
router.get('/:id', getComplaintFeedbackById);
router.put('/:id', updateComplaintFeedback);
// router.put('/:id', complaintFeedbackValidation, validateRequest, updateComplaintFeedback);
router.delete('/:id', deleteComplaintFeedback);

export default router;
