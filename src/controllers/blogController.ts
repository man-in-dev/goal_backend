import { Request, Response } from 'express';
import Blog from '../models/Blog';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import slugify from 'slugify';

// Get all blogs
export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, category, isPublished, isFeatured, search } = req.query;
  
  const query: any = {};
  
  // Filter for published blogs by default for public access
  if (isPublished !== undefined) {
    query.isPublished = isPublished === 'true';
  } else {
    // Default to published only for public access
    query.isPublished = true;
  }
  
  if (category) query.category = category;
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } }
    ];
  }

  const blogs = await Blog.find(query)
    .sort({ publishDate: -1, createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await Blog.countDocuments(query);

  successResponse(res, {
    blogs,
    pagination: {
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
      limit: Number(limit)
    }
  });
});

// Get single blog
export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return errorResponse(res, 'Blog not found', 404);
  }

  // Increment view count
  blog.views += 1;
  await blog.save();

  successResponse(res, blog);
});

// Get blog by slug
export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  
  if (!blog) {
    return errorResponse(res, 'Blog not found', 404);
  }

  // Increment view count
  blog.views += 1;
  await blog.save();

  successResponse(res, blog);
});

// Create new blog
export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.create({...req.body, slug: slugify(req.body.title, {
          lower: true,        // Convert to lowercase
          strict: true,       // Remove special characters
          trim: true          // Trim whitespace
        })});
  successResponse(res, blog, 'Blog created successfully', 201);
});

// Update blog
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!blog) {
    return errorResponse(res, 'Blog not found', 404);
  }

  successResponse(res, blog, 'Blog updated successfully');
});

// Delete blog
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return errorResponse(res, 'Blog not found', 404);
  }

  successResponse(res, null, 'Blog deleted successfully');
});

// Publish/Unpublish blog
export const toggleBlogPublish = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return errorResponse(res, 'Blog not found', 404);
  }

  blog.isPublished = !blog.isPublished;
  if (blog.isPublished && !blog.publishDate) {
    blog.publishDate = new Date();
  }
  await blog.save();

  successResponse(res, blog, `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`);
});

// Toggle blog featured status
export const toggleBlogFeatured = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return errorResponse(res, 'Blog not found', 404);
  }

  blog.isFeatured = !blog.isFeatured;
  await blog.save();

  successResponse(res, blog, `Blog ${blog.isFeatured ? 'featured' : 'unfeatured'} successfully`);
});

// Get featured blogs
export const getFeaturedBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 5 } = req.query;

  const blogs = await Blog.find({
    isPublished: true,
    isFeatured: true
  })
    .sort({ publishDate: -1 })
    .limit(Number(limit));

  successResponse(res, blogs);
});

// Get recent blogs
export const getRecentBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10, category } = req.query;
  
  const query: any = { isPublished: true };
  
  if (category) query.category = category;

  const blogs = await Blog.find(query)
    .sort({ publishDate: -1 })
    .limit(Number(limit));

  successResponse(res, blogs);
});

// Get blogs by category
export const getBlogsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category, limit = 10 } = req.query;
  
  if (!category) {
    return errorResponse(res, 'Category is required', 400);
  }

  const blogs = await Blog.find({
    isPublished: true,
    category
  })
    .sort({ publishDate: -1 })
    .limit(Number(limit));

  successResponse(res, blogs);
});

// Get blogs by tags
export const getBlogsByTags = asyncHandler(async (req: Request, res: Response) => {
  const { tags } = req.query;
  
  if (!tags) {
    return errorResponse(res, 'Tags parameter is required', 400);
  }

  const tagArray = Array.isArray(tags) ? tags : [tags];
  
  const blogs = await Blog.find({
    isPublished: true,
    tags: { $in: tagArray }
  })
    .sort({ publishDate: -1 })
    .limit(10);

  successResponse(res, blogs);
});

// Get popular blogs
export const getPopularBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 5 } = req.query;
  
  const blogs = await Blog.find({ isPublished: true })
    .sort({ views: -1, likes: -1 })
    .limit(Number(limit));

  successResponse(res, blogs);
});

// Get blog statistics
export const getBlogStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Blog.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        published: { $sum: { $cond: ['$isPublished', 1, 0] } },
        featured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
        education: { $sum: { $cond: [{ $eq: ['$category', 'education'] }, 1, 0] } },
        career: { $sum: { $cond: [{ $eq: ['$category', 'career'] }, 1, 0] } },
        technology: { $sum: { $cond: [{ $eq: ['$category', 'technology'] }, 1, 0] } },
        lifestyle: { $sum: { $cond: [{ $eq: ['$category', 'lifestyle'] }, 1, 0] } },
        general: { $sum: { $cond: [{ $eq: ['$category', 'general'] }, 1, 0] } },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: '$likes' },
        totalComments: { $sum: '$comments' },
        avgReadingTime: { $avg: '$readingTime' }
      }
    }
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayBlogs = await Blog.countDocuments({
    createdAt: { $gte: today }
  });

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const weekBlogs = await Blog.countDocuments({
    createdAt: { $gte: thisWeek }
  });

  successResponse(res, {
    ...stats[0],
    todayBlogs,
    weekBlogs
  });
});
