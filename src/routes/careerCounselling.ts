import express from 'express';
import { z } from 'zod';
import {
  getAllCareerCounsellings,
  getCareerCounsellingById,
  createCareerCounselling,
  updateCareerCounselling,
  deleteCareerCounselling,
  getCareerCounsellingStats,
  downloadCareerCounsellingCSV
} from '../controllers/careerCounsellingController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, validateQuery, validateParams } from '../middleware/validation';
import { 
  careerCounsellingFormSchema, 
  updateCareerCounsellingSchema 
} from '../schemas/careerCounsellingSchema';
import { 
  enquiryQuerySchema, 
  enquiryCSVQuerySchema,
  objectIdSchema 
} from '../schemas/commonSchemas';

const router = express.Router();

// Public routes (for form submission)
router.post('/', validateRequest(careerCounsellingFormSchema), createCareerCounselling);

// Protected routes (for admin dashboard)
router.use(authenticateToken);

router.get('/', validateQuery(enquiryQuerySchema), getAllCareerCounsellings);
router.get('/stats', getCareerCounsellingStats);
router.get('/download-csv', validateQuery(enquiryCSVQuerySchema), downloadCareerCounsellingCSV);
router.get('/:id', validateParams(z.object({ id: objectIdSchema })), getCareerCounsellingById);
router.put('/:id', validateParams(z.object({ id: objectIdSchema })), validateRequest(updateCareerCounsellingSchema), updateCareerCounselling);
router.delete('/:id', validateParams(z.object({ id: objectIdSchema })), deleteCareerCounselling);

export default router;
