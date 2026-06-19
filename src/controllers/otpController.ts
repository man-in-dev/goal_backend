import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/response';
import { logger } from '../utils/logger';

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || '1671AgCnJtHK59005008';
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID || '1607100000000272166';

// @desc    Send OTP via MSG91
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
  const url = `https://control.msg91.com/api/v5/otp?template_id=${MSG91_TEMPLATE_ID}&mobile=${formattedMobile}`;

  let msg91Response: globalThis.Response;
  try {
    msg91Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': MSG91_AUTH_KEY,
      },
    });
  } catch (err) {
    logger.error('MSG91 network error on sendOtp', { error: (err as Error).message, mobile: formattedMobile });
    return ApiResponse.error(res, 'Failed to reach SMS gateway', 500);
  }

  const data = await msg91Response.json() as { type: string; message?: string };

  logger.info('MSG91 sendOtp response', { status: msg91Response.status, data, mobile: formattedMobile });

  if (data.type === 'success') {
    return ApiResponse.success(res, null, 'OTP sent successfully');
  } else {
    return ApiResponse.error(res, data.message || 'Failed to send OTP', 400);
  }
});

// @desc    Verify OTP via MSG91
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

  const formattedMobile = `91${mobile}`;
  const url = `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${formattedMobile}`;

  const msg91Response = await fetch(url, {
    method: 'GET',
    headers: {
      'authkey': MSG91_AUTH_KEY,
    },
  });

  const data = await msg91Response.json() as { type: string; message?: string };

  logger.info('MSG91 verifyOtp response', { status: msg91Response.status, data, mobile: formattedMobile });

  if (data.type === 'success' || data.message === 'OTP verified success') {
    return ApiResponse.success(res, null, 'OTP verified successfully');
  } else {
    return ApiResponse.error(res, data.message || 'Invalid OTP', 400);
  }
});

// @desc    Resend OTP via MSG91
// @route   POST /api/otp/resend
// @access  Public
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { mobile, retryType } = req.body;

  if (!mobile) {
    return ApiResponse.error(res, 'Mobile number is required', 400);
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    return ApiResponse.error(res, 'Mobile number must be 10 digits', 400);
  }

  const formattedMobile = `91${mobile}`;
  // retryType: 'voice' for voice call, 'text' for SMS (default)
  const retry = retryType === 'voice' ? 'voice' : 'text';
  const url = `https://control.msg91.com/api/v5/otp/retry?mobile=${formattedMobile}&retrytype=${retry}`;

  const msg91Response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authkey': MSG91_AUTH_KEY,
    },
  });

  const data = await msg91Response.json() as { type: string; message?: string };

  logger.info('MSG91 resendOtp response', { status: msg91Response.status, data, mobile: formattedMobile });

  if (data.type === 'success') {
    return ApiResponse.success(res, null, 'OTP resent successfully');
  } else {
    return ApiResponse.error(res, data.message || 'Failed to resend OTP', 400);
  }
});
