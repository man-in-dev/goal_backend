import express from 'express';
import { sendOtp, verifyOtp, resendOtp } from '../controllers/otpController';

const router = express.Router();

// POST /api/otp/send   - Send OTP to mobile number
router.post('/send', sendOtp);

// POST /api/otp/verify - Verify OTP entered by user
router.post('/verify', verifyOtp);

// POST /api/otp/resend - Resend OTP (retry)
router.post('/resend', resendOtp);

export default router;
