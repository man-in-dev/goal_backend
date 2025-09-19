import { Request, Response } from 'express';
import NewsEvent from '../models/NewsEvent';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';

// Get all news and events
export const getAllNewsEvents = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    type, 
    category,
    // isPublished,
    isFeatured,
    search,
    sortBy = 'publishDate',
    sortOrder = 'desc'
  } = req.query;
  
  const query: any = {};
  
  // Filter for published news events by default for public access
  // if (isPublished !== undefined) {
  //   query.isPublished = isPublished === 'true';
  // } else {
  //   // Default to published only for public access
  //   query.isPublished = true;
  // }
  
  if (type) query.type = type;
  if (category) query.category = category;
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sortObj: any = {};
  if (sortBy === 'publishDate') {
    sortObj.publishDate = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'createdAt') {
    sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'views') {
    sortObj.views = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortObj.publishDate = -1;
    sortObj.createdAt = -1;
  }

  const newsEvents = await NewsEvent.find(query)
    .sort(sortObj)
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await NewsEvent.countDocuments(query);

  successResponse(res, {
    newsEvents,
    pagination: {
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
      limit: Number(limit)
    }
  });
});

// Get single news/event
export const getNewsEventById = asyncHandler(async (req: Request, res: Response) => {
  const newsEvent = await NewsEvent.findById(req.params.id);
  
  if (!newsEvent) {
    return errorResponse(res, 'News/Event not found', 404);
  }

  successResponse(res, newsEvent);
});

// Create new news/event
export const createNewsEvent = asyncHandler(async (req: Request, res: Response) => {
  const newsEvent = await NewsEvent.create(req.body);
  successResponse(res, newsEvent, 'News/Event created successfully', 201);
});

// Update news/event
export const updateNewsEvent = asyncHandler(async (req: Request, res: Response) => {
  const newsEvent = await NewsEvent.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!newsEvent) {
    return errorResponse(res, 'News/Event not found', 404);
  }

  successResponse(res, newsEvent, 'News/Event updated successfully');
});

// Delete news/event
export const deleteNewsEvent = asyncHandler(async (req: Request, res: Response) => {
  const newsEvent = await NewsEvent.findByIdAndDelete(req.params.id);

  if (!newsEvent) {
    return errorResponse(res, 'News/Event not found', 404);
  }

  successResponse(res, null, 'News/Event deleted successfully');
});

// Get recent news/events
export const getRecentNewsEvents = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 5, type } = req.query;
  
  const query: any = { isPublished: true };
  
  if (type) query.type = type;

  const newsEvents = await NewsEvent.find(query)
    .sort({ publishDate: -1, createdAt: -1 })
    .limit(Number(limit));

  successResponse(res, newsEvents);
});

// Get news/events by tags
export const getNewsEventsByTags = asyncHandler(async (req: Request, res: Response) => {
  const { tags } = req.query;
  
  if (!tags) {
    return errorResponse(res, 'Tags parameter is required', 400);
  }

  const tagArray = Array.isArray(tags) ? tags : [tags];
  
  const newsEvents = await NewsEvent.find({
    isPublished: true,
    tags: { $in: tagArray }
  })
    .sort({ publishDate: -1 })
    .limit(10);

  successResponse(res, newsEvents);
});

// Get news/event statistics
export const getNewsEventStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await NewsEvent.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        news: { $sum: { $cond: [{ $eq: ['$type', 'news'] }, 1, 0] } },
        events: { $sum: { $cond: [{ $eq: ['$type', 'event'] }, 1, 0] } },
        announcements: { $sum: { $cond: [{ $eq: ['$type', 'announcement'] }, 1, 0] } }
      }
    }
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayNewsEvents = await NewsEvent.countDocuments({
    createdAt: { $gte: today }
  });

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const weekNewsEvents = await NewsEvent.countDocuments({
    createdAt: { $gte: thisWeek }
  });

  successResponse(res, {
    ...stats[0],
    todayNewsEvents,
    weekNewsEvents
  });
});
