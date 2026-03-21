import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';

// Upload PDF and return the URL
export const uploadPdfController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return errorResponse(res, 'No file uploaded', 400);
  }

  // Construct URL
  // We assume the uploads are served at /uploads
  const filePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads${filePath}`;

  successResponse(res, {
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  }, 'PDF uploaded successfully');
});
