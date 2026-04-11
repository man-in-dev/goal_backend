import {
  submitSummerCampRegistration,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  uploadSummerCampFile
} from '../controllers/summerCampController';
import { uploadSummerCampPhoto, handleSummerCampUploadError } from '../middleware/summerCampUpload';

const router = Router();

// Public routes
router.post('/upload', uploadSummerCampPhoto, uploadSummerCampFile, handleSummerCampUploadError);
router.post('/submit', submitSummerCampRegistration);

// Admin routes (should be protected with auth middleware in server.ts)
router.get('/', getAllRegistrations);
router.patch('/:id/status', updateRegistrationStatus);
router.delete('/:id', deleteRegistration);

export default router;
