import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import Neet2026AnswerKeyAccessRequest from '../models/Neet2026AnswerKeyAccessRequest';
import { ApiResponse } from '../utils/response';

const getIpAddress = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
};

export const createNeet2026AnswerKeyAccessRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, mobileNo, whatsappNo, deviceId, userAgent } = req.body;
    const ipAddress = getIpAddress(req);

    const existing = await Neet2026AnswerKeyAccessRequest.findOne({
      $or: [{ deviceId }, { ipAddress }],
    });

    if (existing) {
      return ApiResponse.success(
        res,
        { accessGranted: true },
        'Access already granted for this device or IP.',
        200
      );
    }

    await Neet2026AnswerKeyAccessRequest.create({
      name,
      mobileNo,
      whatsappNo,
      deviceId,
      ipAddress,
      userAgent,
      status: 'approved',
    });

    return ApiResponse.success(
      res,
      { accessGranted: true },
      'Access request submitted successfully.',
      201
    );
  }
);

export const getNeet2026AnswerKeyAccessRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const requests = await Neet2026AnswerKeyAccessRequest.find().sort({ createdAt: -1 });

    return ApiResponse.success(res, requests, 'Access requests fetched successfully.', 200);
  }
);

export const checkNeet2026AnswerKeyAccessRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { deviceId, ipAddress } = req.query;

    if (!deviceId && !ipAddress) {
      return ApiResponse.error(res, 'Device ID or IP address is required', 400);
    }

    const orConditions: Record<string, string>[] = [];
    if (deviceId) orConditions.push({ deviceId: deviceId as string });
    if (ipAddress) orConditions.push({ ipAddress: ipAddress as string });

    const existing = await Neet2026AnswerKeyAccessRequest.findOne({ $or: orConditions });

    return ApiResponse.success(
      res,
      { accessGranted: !!existing },
      existing ? 'Access granted' : 'No access found',
      200
    );
  }
);

export const deleteNeet2026AnswerKeyAccessRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await Neet2026AnswerKeyAccessRequest.findByIdAndDelete(id);

    if (!deleted) {
      return ApiResponse.error(res, 'Access request not found.', 404);
    }

    return ApiResponse.success(res, null, 'Access request deleted successfully.', 200);
  }
);

export const downloadNeet2026AnswerKeyAccessRequestsCSV = asyncHandler(
  async (req: Request, res: Response) => {
    const requests = await Neet2026AnswerKeyAccessRequest.find().sort({ createdAt: -1 });

    // Generate CSV
    const headers = [
      'Name',
      'Mobile No',
      'WhatsApp No',
      'Device ID',
      'IP Address',
      'User Agent',
      'Status',
      'Submitted Date',
    ];

    const rows = requests.map((req) => [
      `"${req.name.replace(/"/g, '""')}"`,
      `"${req.mobileNo}"`,
      `"${req.whatsappNo}"`,
      `"${req.deviceId}"`,
      `"${req.ipAddress}"`,
      `"${(req.userAgent || '').replace(/"/g, '""')}"`,
      `"${req.status}"`,
      `"${new Date(req.createdAt).toLocaleString('en-IN')}"`,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="neet-2026-access-requests-${new Date().toISOString().split('T')[0]}.csv"`
    );

    return res.send(csv);
  }
);
