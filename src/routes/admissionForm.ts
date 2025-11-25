import { Router } from 'express';
import {
  uploadAdmissionFiles,
  submitAdmissionForm,
  getAdmissionForm,
  getAllAdmissionForms,
  updateAdmissionFormStatus,
  deleteAdmissionForm
} from '../controllers/admissionFormController';
import { uploadAdmissionDocuments, handleAdmissionUploadError } from '../middleware/admissionFormUpload';

const router = Router();

// Public routes
router.post('/upload', uploadAdmissionDocuments, handleAdmissionUploadError, uploadAdmissionFiles);
router.post('/submit', uploadAdmissionDocuments, handleAdmissionUploadError, submitAdmissionForm);
router.get('/:id', getAdmissionForm);

// Admin routes (should be protected with authentication middleware)
router.get('/', getAllAdmissionForms);
router.patch('/:id/status', updateAdmissionFormStatus);
router.delete('/:id', deleteAdmissionForm);

export default router;

