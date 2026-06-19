import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/response';
import { logger } from '../utils/logger';

const SMS_AUTH_KEY = process.env.SMS_AUTH_KEY || '1671AgCnJtHK59005008';
const SMS_SENDER = process.env.SMS_SENDER || 'goaled';
const SMS_DLT_TE_ID = process.env.SMS_DLT_TE_ID || '1607100000000384389';
const SMS_API_URL = 'http://sms.gngsms.com/api/sendhttp.php';

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// @desc    Send OTP via SMS
// @route   POST /api/otp/send
// @access  Public
export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { mobile } = req.body;

  if (!mobile) {
    return ApiResponse.error(res, 'Mobile number is required', 400);
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    return ApiResponse.error(res, 'Mobile number must be 10 digits', 400);
  }

  const formattedMobile = `91${mobile}`;
  const otp = generateOtp();

  otpStore.set(mobile, { otp, expiresAt: Date.now() + OTP_EXPIRY_MS });

  const message = `Dear Students ${otp} is OTP for Goal Institute App log in. GOAL Education Service Private Limited.`;
  const url = `${SMS_API_URL}?authkey=${SMS_AUTH_KEY}&mobiles=${formattedMobile}&message=${encodeURIComponent(message)}&sender=${SMS_SENDER}&route=4&country=91&DLT_TE_ID=${SMS_DLT_TE_ID}`;

  let smsResponse: globalThis.Response;
  try {
    smsResponse = await fetch(url, { method: 'POST' });
  } catch (err) {
    logger.error('SMS network error on sendOtp', { error: (err as Error).message, mobile: formattedMobile });
    return ApiResponse.error(res, 'Failed to reach SMS gateway', 500);
  }

  const text = await smsResponse.text();
  logger.info('SMS sendOtp response', { status: smsResponse.status, body: text, mobile: formattedMobile });

  if (smsResponse.ok) {
    return ApiResponse.success(res, null, 'OTP sent successfully');
  } else {
    return ApiResponse.error(res, text || 'Failed to send OTP', 400);
  }
});

// @desc    Verify OTP
// @route   POST /api/otp/verify
// @access  Public
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return ApiResponse.error(res, 'Mobile number and OTP are required', 400);
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    return ApiResponse.error(res, 'Mobile number must be 10 digits', 400);
  }

  const entry = otpStore.get(mobile);

  if (!entry) {
    return ApiResponse.error(res, 'OTP not found. Please request a new OTP.', 400);
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(mobile);
    return ApiResponse.error(res, 'OTP has expired. Please request a new OTP.', 400);
  }

  if (entry.otp !== otp) {
    return ApiResponse.error(res, 'Invalid OTP', 400);
  }

  otpStore.delete(mobile);
  return ApiResponse.success(res, null, 'OTP verified successfully');
});

// @desc    Resend OTP
// @route   POST /api/otp/resend
// @access  Public
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { mobile } = req.body;

  if (!mobile) {
    return ApiResponse.error(res, 'Mobile number is required', 400);
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    return ApiResponse.error(res, 'Mobile number must be 10 digits', 400);
  }

  const formattedMobile = `91${mobile}`;
  const otp = generateOtp();

  otpStore.set(mobile, { otp, expiresAt: Date.now() + OTP_EXPIRY_MS });

  const message = `Dear Students ${otp} is OTP for Goal Institute App log in. GOAL Education Service Private Limited.`;
  const url = `${SMS_API_URL}?authkey=${SMS_AUTH_KEY}&mobiles=${formattedMobile}&message=${encodeURIComponent(message)}&sender=${SMS_SENDER}&route=4&country=91&DLT_TE_ID=${SMS_DLT_TE_ID}`;

  let smsResponse: globalThis.Response;
  try {
    smsResponse = await fetch(url, { method: 'POST' });
  } catch (err) {
    logger.error('SMS network error on resendOtp', { error: (err as Error).message, mobile: formattedMobile });
    return ApiResponse.error(res, 'Failed to reach SMS gateway', 500);
  }

  const text = await smsResponse.text();
  logger.info('SMS resendOtp response', { status: smsResponse.status, body: text, mobile: formattedMobile });

  if (smsResponse.ok) {
    return ApiResponse.success(res, null, 'OTP resent successfully');
  } else {
    return ApiResponse.error(res, text || 'Failed to resend OTP', 400);
  }
});
