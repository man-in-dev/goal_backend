import express from 'express';
import { body } from 'express-validator';
import {
  createAITSVideoSolution,
  getAITSVideoSolutions,
  getAITSVideoSolution,
  updateAITSVideoSolution,
  deleteAITSVideoSolution,
  bulkDeleteAITSVideoSolutions
} from '../controllers/aitsVideoSolutionController';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

const createValidation = [
  body('testName').trim().notEmpty().withMessage('Test name is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('videoLink').optional().trim().isURL().withMessage('Video link must be a valid URL'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

const updateValidation = [
  body('testName').optional().trim().notEmpty().withMessage('Test name cannot be empty'),
  body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
  body('videoLink').optional().trim().isURL().withMessage('Video link must be a valid URL'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

// Public routes
router.get('/', getAITSVideoSolutions);
router.get('/:id', getAITSVideoSolution);

// Admin routes (add authentication middleware later if needed)
router.post('/', createAITSVideoSolution);
router.put('/:id', updateAITSVideoSolution);
router.delete('/:id', deleteAITSVideoSolution);
router.delete('/', bulkDeleteAITSVideoSolutions);

export default router;

