import { Request, Response } from 'express';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import ReNeetVideoSolution from '../models/ReNeetVideoSolution';

// @desc    Create RE-NEET video solution
// @route   POST /api/re-neet-video-solutions
// @access  Private (Admin)
export const createReNeetVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { testName, subject, videoLink, order, isActive } = req.body;

  const solution = await ReNeetVideoSolution.create({
    testName,
    subject,
    videoLink: videoLink || '',
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true
  });

  return ApiResponse.created(res, {
    solution
  }, 'RE-NEET video solution created successfully');
});

// @desc    Get all RE-NEET video solutions
// @route   GET /api/re-neet-video-solutions
// @access  Public
export const getReNeetVideoSolutions = asyncHandler(async (req: Request, res: Response) => {
  const { activeOnly } = req.query;
  
  const query: any = {};
  if (activeOnly === 'true') {
    query.isActive = true;
  }

  const solutions = await ReNeetVideoSolution.find(query)
    .sort({ order: 1, createdAt: -1 });

  return ApiResponse.success(res, {
    solutions,
    count: solutions.length
  }, 'RE-NEET video solutions fetched successfully');
});

// @desc    Get single RE-NEET video solution
// @route   GET /api/re-neet-video-solutions/:id
// @access  Public
export const getReNeetVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const solution = await ReNeetVideoSolution.findById(id);
  
  if (!solution) {
    return ApiResponse.error(res, 'RE-NEET video solution not found', 404);
  }

  return ApiResponse.success(res, {
    solution
  }, 'RE-NEET video solution fetched successfully');
});

// @desc    Update RE-NEET video solution
// @route   PUT /api/re-neet-video-solutions/:id
// @access  Private (Admin)
export const updateReNeetVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { testName, subject, videoLink, order, isActive } = req.body;

  const solution = await ReNeetVideoSolution.findByIdAndUpdate(
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
    return ApiResponse.error(res, 'RE-NEET video solution not found', 404);
  }

  return ApiResponse.success(res, {
    solution
  }, 'RE-NEET video solution updated successfully');
});

// @desc    Delete RE-NEET video solution
// @route   DELETE /api/re-neet-video-solutions/:id
// @access  Private (Admin)
export const deleteReNeetVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const solution = await ReNeetVideoSolution.findByIdAndDelete(id);

  if (!solution) {
    return ApiResponse.error(res, 'RE-NEET video solution not found', 404);
  }

  return ApiResponse.success(res, null, 'RE-NEET video solution deleted successfully');
});

// @desc    Bulk delete RE-NEET video solutions
// @route   DELETE /api/re-neet-video-solutions
// @access  Private (Admin)
export const bulkDeleteReNeetVideoSolutions = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return ApiResponse.error(res, 'Please provide an array of IDs to delete', 400);
  }

  const result = await ReNeetVideoSolution.deleteMany({ _id: { $in: ids } });

  return ApiResponse.success(res, {
    deletedCount: result.deletedCount
  }, `${result.deletedCount} RE-NEET video solution(s) deleted successfully`);
});
