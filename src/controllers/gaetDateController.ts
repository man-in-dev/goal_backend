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

  // Get all dates
  const dates = await GAETDate.find(filter).lean();

  // Helper function to parse date string to Date object
  const parseDate = (dateStr: string): Date => {
    // Try parsing as-is first (works for "June 15, 2026", "November 5, 2026", etc.)
    let parsed = new Date(dateStr);
    
    // If that fails, try to handle "15 April 2023" format
    if (isNaN(parsed.getTime())) {
      // Try to reformat: "15 April 2023" -> "April 15, 2023"
      const parts = dateStr.trim().split(/\s+/);
      if (parts.length === 3) {
        // Check if first part is a number (day)
        if (/^\d+$/.test(parts[0])) {
          parsed = new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`);
        }
      }
    }
    
    return parsed;
  };

  // Sort dates chronologically (November before December, etc.)
  const sortedDates = dates.sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    
    // If dates are valid, sort by date (chronological order)
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // If one is invalid, put it at the end
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    // Fallback to createdAt if both dates are invalid
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return successResponse(res, { dates: sortedDates }, 'GAET dates retrieved successfully');
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

