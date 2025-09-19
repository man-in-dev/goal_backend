import { Response, NextFunction } from 'express';
import PublicNotice, { IPublicNotice } from '../models/PublicNotice';
import { successResponse, errorResponse } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all public notices
// @route   GET /api/public-notices
// @access  Public
export const getAllPublicNotices = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const {
    page = 1,
    limit = 10,
    category,
    priority,
    isActive,
    isPublished,
    search,
    sortBy = 'publishDate',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter: any = {};

  if (category) {
    filter.category = category;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (isPublished !== undefined) {
    filter.isPublished = isPublished === 'true';
  }

  if (search) {
    filter.$text = { $search: search as string };
  }

  // Build sort object
  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const notices = await PublicNotice.find(filter)
    .populate('createdBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await PublicNotice.countDocuments(filter);

  const pagination = {
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
    totalItems: total,
    itemsPerPage: limitNum
  };

  return successResponse(res, { notices, pagination }, 'Public notices retrieved successfully');
});

// @desc    Get single public notice
// @route   GET /api/public-notices/:id
// @access  Public
export const getPublicNoticeById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const notice = await PublicNotice.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!notice) {
    return errorResponse(res, 'Public notice not found', 404);
  }

  return successResponse(res, notice, 'Public notice retrieved successfully');
});

// @desc    Create new public notice
// @route   POST /api/public-notices
// @access  Public (for form submissions) or Private (for admin)
export const createPublicNotice = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const noticeData = {
    ...req.body,
    // If user is authenticated, use their ID, otherwise leave as null
    createdBy: req.user?.id || null
  };

  const notice = await PublicNotice.create(noticeData);

  return successResponse(res, notice, 'Public notice created successfully', 201);
});

// @desc    Update public notice
// @route   PUT /api/public-notices/:id
// @access  Private (Admin only)
export const updatePublicNotice = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const notice = await PublicNotice.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  if (!notice) {
    return errorResponse(res, 'Public notice not found', 404);
  }

  return successResponse(res, notice, 'Public notice updated successfully');
});

// @desc    Delete public notice
// @route   DELETE /api/public-notices/:id
// @access  Private (Admin only)
export const deletePublicNotice = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const notice = await PublicNotice.findByIdAndDelete(req.params.id);

  if (!notice) {
    return errorResponse(res, 'Public notice not found', 404);
  }

  return successResponse(res, null, 'Public notice deleted successfully');
});

// @desc    Get public notice statistics
// @route   GET /api/public-notices/stats
// @access  Private (Admin only)
export const getPublicNoticeStats = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await PublicNotice.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
          },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          published: 1,
          active: 1,
          draft: { $subtract: ['$total', '$published'] },
          inactive: { $subtract: ['$total', '$active'] }
        }
      }
    ]);

    // Get category stats separately
    const categoryStats = await PublicNotice.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
          },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);

    // Get priority stats separately
    const priorityStats = await PublicNotice.aggregate([
      {
        $group: {
          _id: '$priority',
          total: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
          },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      published: 0,
      active: 0,
      draft: 0,
      inactive: 0
    };

    // Convert category stats to object format
    const categoryStatsObj: any = {};
    categoryStats.forEach((stat: any) => {
      categoryStatsObj[stat._id] = {
        total: stat.total,
        published: stat.published,
        active: stat.active
      };
    });

    // Convert priority stats to object format
    const priorityStatsObj: any = {};
    priorityStats.forEach((stat: any) => {
      priorityStatsObj[stat._id] = {
        total: stat.total,
        published: stat.published,
        active: stat.active
      };
    });

    return successResponse(res, {
      ...result,
      categoryStats: categoryStatsObj,
      priorityStats: priorityStatsObj
    }, 'Public notice statistics retrieved successfully');
  } catch (error) {
    console.error('Error fetching public notice stats:', error);
    return errorResponse(res, 'Failed to fetch public notice statistics', 500, error);
  }
});

