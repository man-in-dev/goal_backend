import express from 'express';
import {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats
} from '../controllers/enquiryController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules - flexible to support different form types
const enquiryValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('studying').optional().isLength({ max: 100 }).withMessage('Studying field cannot exceed 100 characters'),
  body('studyLevel').optional().isLength({ max: 100 }).withMessage('Study level cannot exceed 100 characters'),
  body('course').notEmpty().withMessage('Course is required').isLength({ max: 100 }).withMessage('Course cannot exceed 100 characters'),
  body('state').optional().isLength({ max: 50 }).withMessage('State cannot exceed 50 characters'),
  body('district').optional().isLength({ max: 50 }).withMessage('District cannot exceed 50 characters'),
  body('address').optional().isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),
  body('query').optional().isLength({ max: 1000 }).withMessage('Query cannot exceed 1000 characters'),
  body('message').optional().isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
  body('countryCode').optional().isLength({ max: 5 }).withMessage('Country code cannot exceed 5 characters'),
  body('source').optional().isLength({ max: 50 }).withMessage('Source cannot exceed 50 characters'),
  body('status').optional().isIn(['pending', 'contacted', 'resolved', 'closed']).withMessage('Invalid status')
];

// Public routes (for form submission)
// router.post('/', enquiryValidation, validateRequest, createEnquiry);
router.post('/', createEnquiry);

// Protected routes (for admin dashboard)
router.use(authenticateToken);

router.get('/', getAllEnquiries);
router.get('/stats', getEnquiryStats);
router.get('/:id', getEnquiryById);
// router.put('/:id', enquiryValidation, validateRequest, updateEnquiry);
router.put('/:id', updateEnquiry);
router.delete('/:id', deleteEnquiry);

export default router;
