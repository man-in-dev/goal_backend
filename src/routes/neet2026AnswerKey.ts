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

const router = express.Router();

const createValidation = [
  body('testName').trim().notEmpty().withMessage('Test name is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('pdfLink').optional().trim().isURL().withMessage('PDF link must be a valid URL'),
  body('videoLink').optional().trim().isURL().withMessage('Video link must be a valid URL'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

const updateValidation = [
  body('testName').optional().trim().notEmpty().withMessage('Test name cannot be empty'),
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
router.post('/', createNeetAnswerKey);
router.put('/:id', updateNeetAnswerKey);
router.delete('/:id', deleteNeetAnswerKey);
router.delete('/', bulkDeleteNeetAnswerKeys);

export default router;
