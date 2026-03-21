import { Request, Response } from 'express';
import Pdf from '../models/Pdf';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import fs from 'fs';
import path from 'path';

// @desc    Upload PDF and save to database
// @route   POST /api/upload/pdf
// @access  Private
export const uploadPdfController = asyncHandler(async (req: any, res: Response) => {
  if (!req.file) {
    return errorResponse(res, 'No file uploaded', 400);
  }

  const { name } = req.body;
  if (!name) {
    // If name is missing, cleanup the uploaded file
    fs.unlinkSync(req.file.path);
    return errorResponse(res, 'Document name is required', 400);
  }

  // Construct URL
  const filePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads${filePath}`;

  // Save to database
  const pdf = await Pdf.create({
    name,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    uploadedBy: req.user.id
  });

  successResponse(res, pdf, 'PDF uploaded and saved successfully');
});

// @desc    Get all uploaded PDFs
// @route   GET /api/upload/pdfs
// @access  Private
export const getPdfsController = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search } = req.query;
  
  const query: any = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pdfs = await Pdf.find(query)
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await Pdf.countDocuments(query);

  successResponse(res, {
    pdfs,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    total
  });
});

// @desc    Delete a PDF
// @route   DELETE /api/upload/pdfs/:id
// @access  Private
export const deletePdfController = asyncHandler(async (req: Request, res: Response) => {
  const pdf = await Pdf.findById(req.params.id);

  if (!pdf) {
    return errorResponse(res, 'PDF not found', 404);
  }

  // Delete physical file
  // Need to resolve path correctly based on our server structure
  const rootDir = path.resolve(__dirname, '..', '..');
  const relativePath = pdf.url.split('/uploads/')[1];
  const fullPath = path.join(rootDir, 'uploads', relativePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }

  await pdf.deleteOne();

  successResponse(res, null, 'PDF deleted successfully');
});
