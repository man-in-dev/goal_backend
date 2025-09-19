import { Request, Response } from 'express';
import Banner from '../models/Banner';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';

// Get all banners
export const getAllBanners = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, position, isActive, search } = req.query;
  
  const query: any = {};
  
  if (position) query.position = position;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const banners = await Banner.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await Banner.countDocuments(query);

  successResponse(res, {
    banners,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    total
  });
});

// Get single banner
export const getBannerById = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.findById(req.params.id);
  
  if (!banner) {
    return errorResponse(res, 'Banner not found', 404);
  }

  successResponse(res, banner);
});

// Create new banner
export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  console.log('Creating banner with data:', {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    mobileImageUrl: req.body.mobileImageUrl,
    position: req.body.position
  });
  
  const bannerData = {
    ...req.body,
    // Ensure clicks and impressions start at 0
    clicks: 0,
    impressions: 0
  };
  
  const banner = await Banner.create(bannerData);
  console.log('Banner created successfully:', banner._id);
  successResponse(res, banner, 'Banner created successfully', 201);
});

// Update banner
export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  console.log('Updating banner:', req.params.id, 'with data:', {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    mobileImageUrl: req.body.mobileImageUrl,
    position: req.body.position
  });
  
  const updateData = {
    ...req.body,
    // Don't allow updating clicks and impressions directly
    clicks: undefined,
    impressions: undefined
  };
  
  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });
  
  const banner = await Banner.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!banner) {
    return errorResponse(res, 'Banner not found', 404);
  }

  console.log('Banner updated successfully:', banner._id);
  successResponse(res, banner, 'Banner updated successfully');
});

// Delete banner
export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);

  if (!banner) {
    return errorResponse(res, 'Banner not found', 404);
  }

  successResponse(res, null, 'Banner deleted successfully');
});

// Toggle banner status
export const toggleBannerStatus = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return errorResponse(res, 'Banner not found', 404);
  }

  banner.isActive = !banner.isActive;
  await banner.save();

  successResponse(res, banner, `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`);
});

// Get active banners by position
export const getActiveBannersByPosition = asyncHandler(async (req: Request, res: Response) => {
  const { position } = req.params;
  const { device = 'desktop' } = req.query; // device can be 'desktop' or 'mobile'

  const banners = await Banner.find({
    position,
    isActive: true
  }).sort({ priority: -1, createdAt: -1 });

  // Transform banners to include appropriate image based on device
  const transformedBanners = banners.map(banner => {
    const bannerObj = banner.toObject();
    
    if (device === 'mobile' && banner.mobileImageUrl) {
      // Use mobile image if available and device is mobile
      bannerObj.imageUrl = banner.mobileImageUrl;
      bannerObj.imageAlt = banner.mobileImageAlt || banner.imageAlt;
    }
    // For desktop or if no mobile image, use desktop image (default)
    
    return bannerObj;
  });

  successResponse(res, transformedBanners);
});

// Record banner click
export const recordBannerClick = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return errorResponse(res, 'Banner not found', 404);
  }

  banner.clicks += 1;
  await banner.save();

  successResponse(res, { clicks: banner.clicks }, 'Click recorded successfully');
});

// Record banner impression
export const recordBannerImpression = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return errorResponse(res, 'Banner not found', 404);
  }

  banner.impressions += 1;
  await banner.save();

  successResponse(res, { impressions: banner.impressions }, 'Impression recorded successfully');
});

// Get banner statistics
export const getBannerStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Banner.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: ['$isActive', 1, 0] } },
        inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
        totalClicks: { $sum: '$clicks' },
        totalImpressions: { $sum: '$impressions' },
        hero: { $sum: { $cond: [{ $eq: ['$position', 'hero'] }, 1, 0] } },
        sidebar: { $sum: { $cond: [{ $eq: ['$position', 'sidebar'] }, 1, 0] } },
        footer: { $sum: { $cond: [{ $eq: ['$position', 'footer'] }, 1, 0] } },
        popup: { $sum: { $cond: [{ $eq: ['$position', 'popup'] }, 1, 0] } },
        announcement: { $sum: { $cond: [{ $eq: ['$position', 'announcement'] }, 1, 0] } }
      }
    }
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayBanners = await Banner.countDocuments({
    createdAt: { $gte: today }
  });

  successResponse(res, {
    ...stats[0],
    todayBanners,
    ctr: stats[0]?.totalImpressions > 0 ? 
      ((stats[0]?.totalClicks / stats[0]?.totalImpressions) * 100).toFixed(2) : 0
  });
});
