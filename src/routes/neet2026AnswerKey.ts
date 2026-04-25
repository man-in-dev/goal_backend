import express from 'express';
import { body } from 'express-validator';
import {
  createNeet2026AnswerKey,
  getNeet2026AnswerKeys,
  getNeet2026AnswerKey,
  updateNeet2026AnswerKey,
  deleteNeet2026AnswerKey,
  bulkDeleteNeet2026AnswerKeys
} from '../controllers/neet2026AnswerKeyController';

const router = express.Router();

const createValidation = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('videoLink').optional().trim().isURL().withMessage('Video link must be a valid URL'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

const updateValidation = [
  body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
  body('videoLink').optional().trim().isURL().withMessage('Video link must be a valid URL'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

// Public routes
router.get('/', getNeet2026AnswerKeys);
router.get('/:id', getNeet2026AnswerKey);

// Admin routes
router.post('/', createValidation, createNeet2026AnswerKey);
router.put('/:id', updateValidation, updateNeet2026AnswerKey);
router.delete('/:id', deleteNeet2026AnswerKey);
router.delete('/', bulkDeleteNeet2026AnswerKeys);

export default router;
