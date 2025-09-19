import express from 'express';
import {
  getAllResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
  deleteMultipleResults,
  uploadCSVResults,
  getResultStats,
  getResultsByCourse,
  getResultsByBatch,
  upload
} from '../controllers/resultController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const resultValidation = [
  body('course').notEmpty().withMessage('Course is required'),
  body('testDate').isISO8601().withMessage('Valid test date is required'),
  body('rank').isInt({ min: 1 }).withMessage('Valid rank is required'),
  body('rollNo').notEmpty().withMessage('Roll number is required'),
  body('studentName').notEmpty().withMessage('Student name is required'),
  body('tq').isInt({ min: 0 }).withMessage('Total questions must be a non-negative integer'),
  body('ta').isInt({ min: 0 }).withMessage('Total attempted must be a non-negative integer'),
  body('tr').isInt({ min: 0 }).withMessage('Total right must be a non-negative integer'),
  body('tw').isInt({ min: 0 }).withMessage('Total wrong must be a non-negative integer'),
  body('tl').isInt({ min: 0 }).withMessage('Total left must be a non-negative integer'),
  body('pr').isInt({ min: 0 }).withMessage('Physics right must be a non-negative integer'),
  body('pw').isInt({ min: 0 }).withMessage('Physics wrong must be a non-negative integer'),
  body('cr').isInt({ min: 0 }).withMessage('Chemistry right must be a non-negative integer'),
  body('cw').isInt({ min: 0 }).withMessage('Chemistry wrong must be a non-negative integer'),
  body('br').isInt({ min: 0 }).withMessage('Biology right must be a non-negative integer'),
  body('bw').isInt({ min: 0 }).withMessage('Biology wrong must be a non-negative integer'),
  body('totalMarks').isFloat({ min: 0 }).withMessage('Total marks must be a non-negative number'),
  body('marksPercentage').isFloat({ min: 0, max: 100 }).withMessage('Marks percentage must be between 0 and 100'),
  body('wPercentage').isFloat({ min: 0, max: 100 }).withMessage('Wrong percentage must be between 0 and 100'),
  body('percentile').isFloat({ min: 0, max: 100 }).withMessage('Percentile must be between 0 and 100'),
  body('batch').notEmpty().withMessage('Batch is required'),
  body('branch').notEmpty().withMessage('Branch is required'),
  body('uploadedBy').notEmpty().withMessage('Uploaded by is required')
];

// Public routes
router.get('/course/:course', getResultsByCourse);
router.get('/batch/:batch', getResultsByBatch);

// Protected routes (for admin dashboard)
router.use(authenticateToken);
router.get('/', getAllResults);
router.get('/stats', getResultStats);
router.get('/:id', getResultById);
router.post('/', resultValidation, validateRequest, createResult);
router.post('/upload-csv', upload.single('csvFile'), uploadCSVResults);
router.put('/:id', resultValidation, validateRequest, updateResult);
router.delete('/:id', deleteResult);
router.delete('/multiple', deleteMultipleResults);

export default router;
