import express from 'express';
import { z } from 'zod';
import {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats,
  downloadEnquiriesCSV
} from '../controllers/enquiryController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, validateQuery, validateParams } from '../middleware/validation';
import { 
  enquiryFormSchema, 
  updateEnquirySchema 
} from '../schemas/enquirySchema';
import { 
  enquiryQuerySchema, 
  enquiryCSVQuerySchema,
  objectIdSchema 
} from '../schemas/commonSchemas';

const router = express.Router();

// Public routes (for form submission)
router.post('/', validateRequest(enquiryFormSchema), createEnquiry);

// Protected routes (for admin dashboard)
router.use(authenticateToken);

router.get('/', validateQuery(enquiryQuerySchema), getAllEnquiries);
router.get('/stats', getEnquiryStats);
router.get('/download-csv', validateQuery(enquiryCSVQuerySchema), downloadEnquiriesCSV);
router.get('/:id', validateParams(z.object({ id: objectIdSchema })), getEnquiryById);
router.put('/:id', validateParams(z.object({ id: objectIdSchema })), validateRequest(updateEnquirySchema), updateEnquiry);
router.delete('/:id', validateParams(z.object({ id: objectIdSchema })), deleteEnquiry);

export default router;
