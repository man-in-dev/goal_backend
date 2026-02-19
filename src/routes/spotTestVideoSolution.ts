import express from 'express';
import { body } from 'express-validator';
import {
  createSpotTestVideoSolution,
  getSpotTestVideoSolutions,
  getSpotTestVideoSolution,
  updateSpotTestVideoSolution,
  deleteSpotTestVideoSolution,
  bulkDeleteSpotTestVideoSolutions
} from '../controllers/spotTestVideoSolutionController';

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
router.get('/', getSpotTestVideoSolutions);
router.get('/:id', getSpotTestVideoSolution);

// Admin routes
router.post('/', createValidation, createSpotTestVideoSolution);
router.put('/:id', updateValidation, updateSpotTestVideoSolution);
router.delete('/:id', deleteSpotTestVideoSolution);
router.delete('/', bulkDeleteSpotTestVideoSolutions);

export default router;
