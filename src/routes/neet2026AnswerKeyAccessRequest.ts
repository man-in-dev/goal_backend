import express from 'express';
import { createNeet2026AnswerKeyAccessRequest, getNeet2026AnswerKeyAccessRequests, deleteNeet2026AnswerKeyAccessRequest, downloadNeet2026AnswerKeyAccessRequestsCSV } from '../controllers/neet2026AnswerKeyAccessRequestController';
import { validateRequest } from '../middleware/validation';
import { neet2026AnswerKeyAccessRequestSchema } from '../schemas/neet2026AnswerKeyAccessRequestSchema';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/submit', validateRequest(neet2026AnswerKeyAccessRequestSchema), createNeet2026AnswerKeyAccessRequest);
router.get('/download-csv', authenticateToken, downloadNeet2026AnswerKeyAccessRequestsCSV);
router.get('/', authenticateToken, getNeet2026AnswerKeyAccessRequests);
router.delete('/:id', authenticateToken, deleteNeet2026AnswerKeyAccessRequest);

export default router;
