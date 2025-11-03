import express from 'express';
import { body } from 'express-validator';
import { submitAnswerKey, getAnswerKeys, deleteAnswerKey } from '../controllers/gvetController';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

const answerKeyValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('rollNo').trim().notEmpty().withMessage('Roll No is required'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone is required'),
  body('questionNo').trim().notEmpty().withMessage('Question No is required'),
  body('explanation').trim().isLength({ min: 5 }).withMessage('Explanation must be at least 5 characters'),
];

router.post('/answer-key', submitAnswerKey);
router.get('/answer-key', getAnswerKeys);
router.delete('/answer-key/:id', deleteAnswerKey);

export default router;


