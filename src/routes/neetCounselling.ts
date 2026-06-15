import express from 'express';
import { z } from 'zod';
import {
  getAllNEETCounsellings,
  getNEETCounsellingById,
  createNEETCounselling,
  updateNEETCounselling,
  deleteNEETCounselling,
  getNEETCounsellingStats,
  downloadNEETCounsellingCSV
} from '../controllers/neetCounsellingController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, validateQuery, validateParams } from '../middleware/validation';
import { 
  neetCounsellingFormSchema, 
  updateNEETCounsellingSchema 
} from '../schemas/neetCounsellingSchema';
import { 
  enquiryQuerySchema, 
  enquiryCSVQuerySchema,
  objectIdSchema 
} from '../schemas/commonSchemas';

const router = express.Router();

// Public routes (for form submission)
router.post('/', validateRequest(neetCounsellingFormSchema), createNEETCounselling);

// Protected routes (for admin dashboard)
router.use(authenticateToken);

router.get('/', validateQuery(enquiryQuerySchema), getAllNEETCounsellings);
router.get('/stats', getNEETCounsellingStats);
router.get('/download-csv', validateQuery(enquiryCSVQuerySchema), downloadNEETCounsellingCSV);
router.get('/:id', validateParams(z.object({ id: objectIdSchema })), getNEETCounsellingById);
router.put('/:id', validateParams(z.object({ id: objectIdSchema })), validateRequest(updateNEETCounsellingSchema), updateNEETCounselling);
router.delete('/:id', validateParams(z.object({ id: objectIdSchema })), deleteNEETCounselling);

export default router;
