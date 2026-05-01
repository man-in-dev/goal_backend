import express from 'express';
import { body } from 'express-validator';
import {
  createNeetAnswerKey,
  getNeetAnswerKeys,
  getNeetAnswerKey,
  updateNeetAnswerKey,
  deleteNeetAnswerKey,
  bulkDeleteNeetAnswerKeys
} from '../controllers/neetAnswerKeyController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

const createValidation = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('pdfLink').optional().trim().isURL().withMessage('PDF link must be a valid URL'),
  body('videoLink').optional().trim().isURL().withMessage('Video link must be a valid URL'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

const updateValidation = [
  body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
  body('pdfLink').optional().trim().isURL().withMessage('PDF link must be a valid URL'),
  body('videoLink').optional().trim().isURL().withMessage('Video link must be a valid URL'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

// Public routes
router.get('/', getNeetAnswerKeys);
router.get('/:id', getNeetAnswerKey);

// Admin routes
router.post('/', authenticateToken, createNeetAnswerKey);
router.put('/:id', authenticateToken, updateNeetAnswerKey);
router.delete('/:id', authenticateToken, deleteNeetAnswerKey);
router.delete('/', authenticateToken, bulkDeleteNeetAnswerKeys);

export default router;
