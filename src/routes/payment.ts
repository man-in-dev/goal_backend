import { Router } from 'express';
import {
  initiatePayment,
  handlePaymentCallback,
  getPaymentStatus,
  getPaymentByEnquiry
} from '../controllers/paymentController';

const router = Router();

// Public routes
router.post('/initiate', initiatePayment);
router.post('/callback', handlePaymentCallback);
router.get('/callback', handlePaymentCallback); // ICICI may send callback via GET
router.get('/status/:transactionId', getPaymentStatus);
router.get('/enquiry/:enquiryId', getPaymentByEnquiry);

export default router;

