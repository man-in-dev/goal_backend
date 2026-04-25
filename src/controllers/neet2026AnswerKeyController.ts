import { Request, Response } from 'express';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import Neet2026AnswerKey from '../models/Neet2026AnswerKey';

// @desc    Create NEET 2026 Answer Key
// @route   POST /api/neet-2026-answerkey
// @access  Private (Admin)
export const createNeet2026AnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { subject, videoLink, order, isActive } = req.body;

  const key = await Neet2026AnswerKey.create({
    subject,
    videoLink: videoLink || '',
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true
  });

  return ApiResponse.created(res, {
    key
  }, 'NEET 2026 Answer Key created successfully');
});

// @desc    Get all NEET 2026 Answer Keys
// @route   GET /api/neet-2026-answerkey
// @access  Public
export const getNeet2026AnswerKeys = asyncHandler(async (req: Request, res: Response) => {
  const { activeOnly } = req.query;

  const query: any = {};
  if (activeOnly === 'true') {
    query.isActive = true;
  }

  const keys = await Neet2026AnswerKey.find(query)
    .sort({ order: 1, createdAt: -1 });

  return ApiResponse.success(res, {
    keys,
    count: keys.length
  }, 'NEET 2026 Answer Keys fetched successfully');
});

// @desc    Get single NEET 2026 Answer Key
// @route   GET /api/neet-2026-answerkey/:id
// @access  Public
export const getNeet2026AnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const key = await Neet2026AnswerKey.findById(id);

  if (!key) {
    return ApiResponse.error(res, 'NEET 2026 Answer Key not found', 404);
  }

  return ApiResponse.success(res, {
    key
  }, 'NEET 2026 Answer Key fetched successfully');
});

// @desc    Update NEET 2026 Answer Key
// @route   PUT /api/neet-2026-answerkey/:id
// @access  Private (Admin)
export const updateNeet2026AnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subject, videoLink, order, isActive } = req.body;

  const key = await Neet2026AnswerKey.findByIdAndUpdate(
    id,
    {
      ...(subject && { subject }),
      ...(videoLink !== undefined && { videoLink }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive })
    },
    { new: true, runValidators: true }
  );

  if (!key) {
    return ApiResponse.error(res, 'NEET 2026 Answer Key not found', 404);
  }

  return ApiResponse.success(res, {
    key
  }, 'NEET 2026 Answer Key updated successfully');
});

// @desc    Delete NEET 2026 Answer Key
// @route   DELETE /api/neet-2026-answerkey/:id
// @access  Private (Admin)
export const deleteNeet2026AnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const key = await Neet2026AnswerKey.findByIdAndDelete(id);

  if (!key) {
    return ApiResponse.error(res, 'NEET 2026 Answer Key not found', 404);
  }

  return ApiResponse.success(res, null, 'NEET 2026 Answer Key deleted successfully');
});

// @desc    Bulk delete NEET 2026 Answer Keys
// @route   DELETE /api/neet-2026-answerkey
// @access  Private (Admin)
export const bulkDeleteNeet2026AnswerKeys = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return ApiResponse.error(res, 'Please provide an array of IDs to delete', 400);
  }

  const result = await Neet2026AnswerKey.deleteMany({ _id: { $in: ids } });

  return ApiResponse.success(res, {
    deletedCount: result.deletedCount
  }, `${result.deletedCount} NEET 2026 Answer Key(s) deleted successfully`);
});
