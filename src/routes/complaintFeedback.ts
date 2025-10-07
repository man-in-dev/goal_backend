import express from 'express';
import { z } from 'zod';
import {
  getAllComplaintsFeedback,
  getComplaintFeedbackById,
  createComplaintFeedback,
  updateComplaintFeedback,
  deleteComplaintFeedback,
  getComplaintFeedbackStats,
  downloadComplaintsFeedbackCSV
} from '../controllers/complaintFeedbackController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, validateQuery, validateParams } from '../middleware/validation';
import { 
  complaintFeedbackSchema, 
  updateComplaintFeedbackSchema 
} from '../schemas/complaintFeedbackSchema';
import { 
  complaintQuerySchema, 
  complaintCSVQuerySchema,
  objectIdSchema 
} from '../schemas/commonSchemas';

const router = express.Router();

// Public routes (for form submission)
router.post('/', validateRequest(complaintFeedbackSchema), createComplaintFeedback);

// Protected routes (for admin dashboard)
router.use(authenticateToken);

router.get('/', validateQuery(complaintQuerySchema), getAllComplaintsFeedback);
router.get('/stats', getComplaintFeedbackStats);
router.get('/download-csv', validateQuery(complaintCSVQuerySchema), downloadComplaintsFeedbackCSV);
router.get('/:id', validateParams(z.object({ id: objectIdSchema })), getComplaintFeedbackById);
router.put('/:id', validateParams(z.object({ id: objectIdSchema })), validateRequest(updateComplaintFeedbackSchema), updateComplaintFeedback);
router.delete('/:id', validateParams(z.object({ id: objectIdSchema })), deleteComplaintFeedback);

export default router;
