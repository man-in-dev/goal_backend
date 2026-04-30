import { Request, Response } from 'express';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import NeetAnswerKey from '../models/NeetAnswerKey';

// @desc    Create NEET answer key
// @route   POST /api/neet-2026-answerkey
// @access  Private (Admin)
export const createNeetAnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { testName, subject, pdfLink, videoLink, order, isActive } = req.body;

  const key = await NeetAnswerKey.create({
    testName,
    subject,
    pdfLink: pdfLink || '',
    videoLink: videoLink || '',
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true
  });

  return ApiResponse.created(res, {
    key
  }, 'NEET answer key created successfully');
});

// @desc    Get all NEET answer keys
// @route   GET /api/neet-2026-answerkey
// @access  Public
export const getNeetAnswerKeys = asyncHandler(async (req: Request, res: Response) => {
  const { activeOnly } = req.query;
  
  const query: any = {};
  if (activeOnly === 'true') {
    query.isActive = true;
  }

  const keys = await NeetAnswerKey.find(query)
    .sort({ order: 1, createdAt: -1 });

  return ApiResponse.success(res, {
    keys,
    count: keys.length
  }, 'NEET answer keys fetched successfully');
});

// @desc    Get single NEET answer key
// @route   GET /api/neet-2026-answerkey/:id
// @access  Public
export const getNeetAnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const key = await NeetAnswerKey.findById(id);
  
  if (!key) {
    return ApiResponse.error(res, 'NEET answer key not found', 404);
  }

  return ApiResponse.success(res, {
    key
  }, 'NEET answer key fetched successfully');
});

// @desc    Update NEET answer key
// @route   PUT /api/neet-2026-answerkey/:id
// @access  Private (Admin)
export const updateNeetAnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { testName, subject, pdfLink, videoLink, order, isActive } = req.body;

  const key = await NeetAnswerKey.findByIdAndUpdate(
    id,
    {
      ...(testName && { testName }),
      ...(subject && { subject }),
      ...(pdfLink !== undefined && { pdfLink }),
      ...(videoLink !== undefined && { videoLink }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive })
    },
    { new: true, runValidators: true }
  );

  if (!key) {
    return ApiResponse.error(res, 'NEET answer key not found', 404);
  }

  return ApiResponse.success(res, {
    key
  }, 'NEET answer key updated successfully');
});

// @desc    Delete NEET answer key
// @route   DELETE /api/neet-2026-answerkey/:id
// @access  Private (Admin)
export const deleteNeetAnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const key = await NeetAnswerKey.findByIdAndDelete(id);

  if (!key) {
    return ApiResponse.error(res, 'NEET answer key not found', 404);
  }

  return ApiResponse.success(res, null, 'NEET answer key deleted successfully');
});

// @desc    Bulk delete NEET answer keys
// @route   DELETE /api/neet-2026-answerkey
// @access  Private (Admin)
export const bulkDeleteNeetAnswerKeys = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return ApiResponse.error(res, 'Please provide an array of IDs to delete', 400);
  }

  const result = await NeetAnswerKey.deleteMany({ _id: { $in: ids } });

  return ApiResponse.success(res, {
    deletedCount: result.deletedCount
  }, `${result.deletedCount} NEET answer key(s) deleted successfully`);
});
