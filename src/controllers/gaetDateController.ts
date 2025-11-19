import { Response, NextFunction } from 'express';
import GAETDate, { IGAETDate } from '../models/GAETDate';
import { successResponse, errorResponse } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all GAET dates
// @route   GET /api/gaet-dates
// @access  Public
export const getAllGAETDates = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { isActive } = req.query;

  // Build filter object
  const filter: any = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  // Get all active dates sorted by date
  const dates = await GAETDate.find(filter)
    .sort({ date: 1, createdAt: -1 })
    .lean();

  return successResponse(res, { dates }, 'GAET dates retrieved successfully');
});

// @desc    Get single GAET date
// @route   GET /api/gaet-dates/:id
// @access  Public
export const getGAETDateById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const date = await GAETDate.findById(req.params.id).lean();

  if (!date) {
    return errorResponse(res, 'GAET date not found', 404);
  }

  return successResponse(res, { date }, 'GAET date retrieved successfully');
});

// @desc    Create GAET date
// @route   POST /api/gaet-dates
// @access  Private/Admin
export const createGAETDate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { date, mode, isActive } = req.body;

  const gaetDate = await GAETDate.create({
    date,
    mode,
    isActive: isActive !== undefined ? isActive : true,
  });

  return successResponse(res, { date: gaetDate }, 'GAET date created successfully', 201);
});

// @desc    Update GAET date
// @route   PUT /api/gaet-dates/:id
// @access  Private/Admin
export const updateGAETDate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { date, mode, isActive } = req.body;

  const gaetDate = await GAETDate.findByIdAndUpdate(
    req.params.id,
    {
      ...(date && { date }),
      ...(mode && { mode }),
      ...(isActive !== undefined && { isActive }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!gaetDate) {
    return errorResponse(res, 'GAET date not found', 404);
  }

  return successResponse(res, { date: gaetDate }, 'GAET date updated successfully');
});

// @desc    Delete GAET date
// @route   DELETE /api/gaet-dates/:id
// @access  Private/Admin
export const deleteGAETDate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const gaetDate = await GAETDate.findByIdAndDelete(req.params.id);

  if (!gaetDate) {
    return errorResponse(res, 'GAET date not found', 404);
  }

  return successResponse(res, null, 'GAET date deleted successfully');
});

