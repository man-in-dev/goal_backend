import { Request, Response } from 'express';
import PageImage from '../models/PageImage';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';

// Get all images
export const getAllPageImages = asyncHandler(async (req: Request, res: Response) => {
  const { page: pageType, isActive } = req.query;
  
  const query: any = {};
  if (pageType) query.page = pageType;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const images = await PageImage.find(query)
    .sort({ priority: -1, createdAt: -1 });

  successResponse(res, images);
});

// Create new image
export const createPageImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await PageImage.create(req.body);
  successResponse(res, image, 'Image created successfully', 201);
});

// Update image
export const updatePageImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await PageImage.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!image) {
    return errorResponse(res, 'Image not found', 404);
  }

  successResponse(res, image, 'Image updated successfully');
});

// Delete image
export const deletePageImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await PageImage.findByIdAndDelete(req.params.id);

  if (!image) {
    return errorResponse(res, 'Image not found', 404);
  }

  successResponse(res, null, 'Image deleted successfully');
});

// Toggle image status
export const togglePageImageStatus = asyncHandler(async (req: Request, res: Response) => {
  const image = await PageImage.findById(req.params.id);

  if (!image) {
    return errorResponse(res, 'Image not found', 404);
  }

  image.isActive = !image.isActive;
  await image.save();

  successResponse(res, image, `Image ${image.isActive ? 'activated' : 'deactivated'} successfully`);
});

// Get active images by page type
export const getActiveImagesByPage = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.params;

  const images = await PageImage.find({
    page,
    isActive: true
  }).sort({ priority: -1, createdAt: -1 });

  successResponse(res, images);
});
