import { Request, Response } from 'express';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import AITSVideoSolution from '../models/AITSVideoSolution';

// @desc    Create AITS video solution
// @route   POST /api/aits-video-solutions
// @access  Private (Admin)
export const createAITSVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { testName, subject, videoLink, order, isActive } = req.body;

  const solution = await AITSVideoSolution.create({
    testName,
    subject,
    videoLink: videoLink || '',
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true
  });

  return ApiResponse.created(res, {
    solution
  }, 'AITS video solution created successfully');
});

// @desc    Get all AITS video solutions
// @route   GET /api/aits-video-solutions
// @access  Public
export const getAITSVideoSolutions = asyncHandler(async (req: Request, res: Response) => {
  const { activeOnly } = req.query;
  
  const query: any = {};
  if (activeOnly === 'true') {
    query.isActive = true;
  }

  const solutions = await AITSVideoSolution.find(query)
    .sort({ order: 1, createdAt: -1 });

  return ApiResponse.success(res, {
    solutions,
    count: solutions.length
  }, 'AITS video solutions fetched successfully');
});

// @desc    Get single AITS video solution
// @route   GET /api/aits-video-solutions/:id
// @access  Public
export const getAITSVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const solution = await AITSVideoSolution.findById(id);
  
  if (!solution) {
    return ApiResponse.error(res, 'AITS video solution not found', 404);
  }

  return ApiResponse.success(res, {
    solution
  }, 'AITS video solution fetched successfully');
});

// @desc    Update AITS video solution
// @route   PUT /api/aits-video-solutions/:id
// @access  Private (Admin)
export const updateAITSVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { testName, subject, videoLink, order, isActive } = req.body;

  const solution = await AITSVideoSolution.findByIdAndUpdate(
    id,
    {
      ...(testName && { testName }),
      ...(subject && { subject }),
      ...(videoLink !== undefined && { videoLink }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive })
    },
    { new: true, runValidators: true }
  );

  if (!solution) {
    return ApiResponse.error(res, 'AITS video solution not found', 404);
  }

  return ApiResponse.success(res, {
    solution
  }, 'AITS video solution updated successfully');
});

// @desc    Delete AITS video solution
// @route   DELETE /api/aits-video-solutions/:id
// @access  Private (Admin)
export const deleteAITSVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const solution = await AITSVideoSolution.findByIdAndDelete(id);

  if (!solution) {
    return ApiResponse.error(res, 'AITS video solution not found', 404);
  }

  return ApiResponse.success(res, null, 'AITS video solution deleted successfully');
});

// @desc    Bulk delete AITS video solutions
// @route   DELETE /api/aits-video-solutions
// @access  Private (Admin)
export const bulkDeleteAITSVideoSolutions = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return ApiResponse.error(res, 'Please provide an array of IDs to delete', 400);
  }

  const result = await AITSVideoSolution.deleteMany({ _id: { $in: ids } });

  return ApiResponse.success(res, {
    deletedCount: result.deletedCount
  }, `${result.deletedCount} AITS video solution(s) deleted successfully`);
});

