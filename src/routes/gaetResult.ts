import express from 'express';
import {
  getAllGAETResults,
  getGAETResultById,
  createGAETResult,
  updateGAETResult,
  deleteGAETResult,
  deleteMultipleGAETResults,
  uploadCSVGAETResults,
  getGAETResultStats,
  getGAETResultByRollNo,
  upload
} from '../controllers/gaetResultController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const gaetResultValidation = [
  body('rollNo').notEmpty().withMessage('Roll number is required'),
  body('studentName').notEmpty().withMessage('Student name is required'),
  body('testName').notEmpty().withMessage('Test name is required'),
  body('tq').isInt({ min: 0 }).withMessage('Total questions must be a non-negative integer'),
  body('tr').isInt({ min: 0 }).withMessage('Total right must be a non-negative integer'),
  body('tw').isInt({ min: 0 }).withMessage('Total wrong must be a non-negative integer'),
  body('tl').isInt({ min: 0 }).withMessage('Total left must be a non-negative integer'),
  body('pr').isInt({ min: 0 }).withMessage('Physics right must be a non-negative integer'),
  body('pw').isInt({ min: 0 }).withMessage('Physics wrong must be a non-negative integer'),
  body('cr').isInt({ min: 0 }).withMessage('Chemistry right must be a non-negative integer'),
  body('cw').isInt({ min: 0 }).withMessage('Chemistry wrong must be a non-negative integer'),
  body('mr').isInt({ min: 0 }).withMessage('Math right must be a non-negative integer'),
  body('mw').isInt({ min: 0 }).withMessage('Math wrong must be a non-negative integer'),
  body('br').isInt({ min: 0 }).withMessage('Biology right must be a non-negative integer'),
  body('bw').isInt({ min: 0 }).withMessage('Biology wrong must be a non-negative integer'),
  body('gkr').isInt({ min: 0 }).withMessage('GK right must be a non-negative integer'),
  body('gkw').isInt({ min: 0 }).withMessage('GK wrong must be a non-negative integer'),
  body('totalMarks').isFloat({ min: 0 }).withMessage('Total marks must be a non-negative number'),
  body('marksPercentage').isFloat({ min: 0, max: 100 }).withMessage('Marks percentage must be between 0 and 100'),
  body('testDate').notEmpty().withMessage('Test date is required')
];

// Public routes for student-facing result fetching
router.get('/student/:rollNo', getGAETResultByRollNo);

// Protected routes (for admin dashboard)
router.use(authenticateToken);

router.get('/', getAllGAETResults);
router.get('/stats', getGAETResultStats);
router.get('/:id', getGAETResultById);
router.post('/', gaetResultValidation, validateRequest, createGAETResult);
router.post('/upload-csv', upload.single('csvFile'), uploadCSVGAETResults);
router.delete('/multiple', deleteMultipleGAETResults); // Must be before /:id route
router.put('/:id', updateGAETResult);
router.delete('/:id', deleteGAETResult);

export default router;

