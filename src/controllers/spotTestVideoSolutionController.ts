import { Request, Response } from 'express';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import SpotTestVideoSolution from '../models/SpotTestVideoSolution';

// @desc    Create Spot Test video solution
// @route   POST /api/spot-test-video-solutions
// @access  Private (Admin)
export const createSpotTestVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { testName, subject, videoLink, order, isActive } = req.body;

  const solution = await SpotTestVideoSolution.create({
    testName,
    subject,
    videoLink: videoLink || '',
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true
  });

  return ApiResponse.created(res, {
    solution
  }, 'Spot Test video solution created successfully');
});

// @desc    Get all Spot Test video solutions
// @route   GET /api/spot-test-video-solutions
// @access  Public
export const getSpotTestVideoSolutions = asyncHandler(async (req: Request, res: Response) => {
  const { activeOnly } = req.query;

  const query: any = {};
  if (activeOnly === 'true') {
    query.isActive = true;
  }

  const solutions = await SpotTestVideoSolution.find(query)
    .sort({ order: 1, createdAt: -1 });

  return ApiResponse.success(res, {
    solutions,
    count: solutions.length
  }, 'Spot Test video solutions fetched successfully');
});

// @desc    Get single Spot Test video solution
// @route   GET /api/spot-test-video-solutions/:id
// @access  Public
export const getSpotTestVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const solution = await SpotTestVideoSolution.findById(id);

  if (!solution) {
    return ApiResponse.error(res, 'Spot Test video solution not found', 404);
  }

  return ApiResponse.success(res, {
    solution
  }, 'Spot Test video solution fetched successfully');
});

// @desc    Update Spot Test video solution
// @route   PUT /api/spot-test-video-solutions/:id
// @access  Private (Admin)
export const updateSpotTestVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { testName, subject, videoLink, order, isActive } = req.body;

  const solution = await SpotTestVideoSolution.findByIdAndUpdate(
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
    return ApiResponse.error(res, 'Spot Test video solution not found', 404);
  }

  return ApiResponse.success(res, {
    solution
  }, 'Spot Test video solution updated successfully');
});

// @desc    Delete Spot Test video solution
// @route   DELETE /api/spot-test-video-solutions/:id
// @access  Private (Admin)
export const deleteSpotTestVideoSolution = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const solution = await SpotTestVideoSolution.findByIdAndDelete(id);

  if (!solution) {
    return ApiResponse.error(res, 'Spot Test video solution not found', 404);
  }

  return ApiResponse.success(res, null, 'Spot Test video solution deleted successfully');
});

// @desc    Bulk delete Spot Test video solutions
// @route   DELETE /api/spot-test-video-solutions
// @access  Private (Admin)
export const bulkDeleteSpotTestVideoSolutions = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return ApiResponse.error(res, 'Please provide an array of IDs to delete', 400);
  }

  const result = await SpotTestVideoSolution.deleteMany({ _id: { $in: ids } });

  return ApiResponse.success(res, {
    deletedCount: result.deletedCount
  }, `${result.deletedCount} Spot Test video solution(s) deleted successfully`);
});
