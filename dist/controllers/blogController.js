"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogStats = exports.incrementBlogView = exports.toggleBlogLike = exports.getPopularBlogs = exports.getBlogsByTags = exports.getBlogsByCategory = exports.getRecentBlogs = exports.getFeaturedBlogs = exports.toggleBlogFeatured = exports.toggleBlogPublish = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogBySlug = exports.getBlogById = exports.getAllBlogs = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const slugify_1 = __importDefault(require("slugify"));
// Get all blogs
exports.getAllBlogs = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, category, isPublished, isFeatured, search } = req.query;
    const query = {};
    // Filter for published blogs by default for public access
    if (isPublished !== undefined) {
        query.isPublished = isPublished === 'true';
    }
    else {
        // Default to published only for public access
        query.isPublished = true;
    }
    if (category)
        query.category = category;
    if (isFeatured !== undefined)
        query.isFeatured = isFeatured === 'true';
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { excerpt: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } }
        ];
    }
    const blogs = yield Blog_1.default.find(query)
        .sort({ publishDate: -1, createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));
    const total = yield Blog_1.default.countDocuments(query);
    (0, response_1.successResponse)(res, {
        blogs,
        pagination: {
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total,
            limit: Number(limit)
        }
    });
}));
// Get single blog
exports.getBlogById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog_1.default.findById(req.params.id);
    if (!blog) {
        return (0, response_1.errorResponse)(res, 'Blog not found', 404);
    }
    // Increment view count
    blog.views += 1;
    yield blog.save();
    (0, response_1.successResponse)(res, blog);
}));
// Get blog by slug
exports.getBlogBySlug = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog_1.default.findOne({ slug: req.params.slug });
    if (!blog) {
        return (0, response_1.errorResponse)(res, 'Blog not found', 404);
    }
    // Increment view count
    blog.views += 1;
    yield blog.save();
    (0, response_1.successResponse)(res, blog);
}));
// Create new blog
exports.createBlog = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog_1.default.create(Object.assign(Object.assign({}, req.body), { slug: (0, slugify_1.default)(req.body.title, {
            lower: true, // Convert to lowercase
            strict: true, // Remove special characters
            trim: true // Trim whitespace
        }) }));
    (0, response_1.successResponse)(res, blog, 'Blog created successfully', 201);
}));
// Update blog
exports.updateBlog = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) {
        return (0, response_1.errorResponse)(res, 'Blog not found', 404);
    }
    (0, response_1.successResponse)(res, blog, 'Blog updated successfully');
}));
// Delete blog
exports.deleteBlog = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog_1.default.findByIdAndDelete(req.params.id);
    if (!blog) {
        return (0, response_1.errorResponse)(res, 'Blog not found', 404);
    }
    (0, response_1.successResponse)(res, null, 'Blog deleted successfully');
}));
// Publish/Unpublish blog
exports.toggleBlogPublish = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog_1.default.findById(req.params.id);
    if (!blog) {
        return (0, response_1.errorResponse)(res, 'Blog not found', 404);
    }
    blog.isPublished = !blog.isPublished;
    if (blog.isPublished && !blog.publishDate) {
        blog.publishDate = new Date();
    }
    yield blog.save();
    (0, response_1.successResponse)(res, blog, `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`);
}));
// Toggle blog featured status
exports.toggleBlogFeatured = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog_1.default.findById(req.params.id);
    if (!blog) {
        return (0, response_1.errorResponse)(res, 'Blog not found', 404);
    }
    blog.isFeatured = !blog.isFeatured;
    yield blog.save();
    (0, response_1.successResponse)(res, blog, `Blog ${blog.isFeatured ? 'featured' : 'unfeatured'} successfully`);
}));
// Get featured blogs
exports.getFeaturedBlogs = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 5 } = req.query;
    const blogs = yield Blog_1.default.find({
        isPublished: true,
        isFeatured: true
    })
        .sort({ publishDate: -1 })
        .limit(Number(limit));
    (0, response_1.successResponse)(res, blogs);
}));
// Get recent blogs
exports.getRecentBlogs = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, category } = req.query;
    const query = { isPublished: true };
    if (category)
        query.category = category;
    const blogs = yield Blog_1.default.find(query)
        .sort({ publishDate: -1 })
        .limit(Number(limit));
    (0, response_1.successResponse)(res, blogs);
}));
// Get blogs by category
exports.getBlogsByCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, limit = 10 } = req.query;
    if (!category) {
        return (0, response_1.errorResponse)(res, 'Category is required', 400);
    }
    const blogs = yield Blog_1.default.find({
        isPublished: true,
        category
    })
        .sort({ publishDate: -1 })
        .limit(Number(limit));
    (0, response_1.successResponse)(res, blogs);
}));
// Get blogs by tags
exports.getBlogsByTags = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tags } = req.query;
    if (!tags) {
        return (0, response_1.errorResponse)(res, 'Tags parameter is required', 400);
    }
    const tagArray = Array.isArray(tags) ? tags : [tags];
    const blogs = yield Blog_1.default.find({
        isPublished: true,
        tags: { $in: tagArray }
    })
        .sort({ publishDate: -1 })
        .limit(10);
    (0, response_1.successResponse)(res, blogs);
}));
// Get popular blogs
exports.getPopularBlogs = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 5 } = req.query;
    const blogs = yield Blog_1.default.find({ isPublished: true })
        .sort({ views: -1, likes: -1 })
        .limit(Number(limit));
    (0, response_1.successResponse)(res, blogs);
}));
// Toggle like for a blog
exports.toggleBlogLike = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog_1.default.findById(req.params.id);
    if (!blog) {
        return (0, response_1.errorResponse)(res, 'Blog not found', 404);
    }
    // For now, we'll just increment/decrement likes
    // In a real application, you might want to track which users liked which blogs
    const { action } = req.body; // 'like' or 'unlike'
    if (action === 'like') {
        blog.likes += 1;
    }
    else if (action === 'unlike') {
        blog.likes = Math.max(0, blog.likes - 1);
    }
    else {
        return (0, response_1.errorResponse)(res, 'Invalid action. Use "like" or "unlike"', 400);
    }
    yield blog.save();
    (0, response_1.successResponse)(res, {
        likes: blog.likes,
        action: action
    }, `Blog ${action}d successfully`);
}));
// Increment view count for a blog
exports.incrementBlogView = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog_1.default.findById(req.params.id);
    if (!blog) {
        return (0, response_1.errorResponse)(res, 'Blog not found', 404);
    }
    blog.views += 1;
    yield blog.save();
    (0, response_1.successResponse)(res, {
        views: blog.views
    }, 'View count incremented successfully');
}));
// Get blog statistics
exports.getBlogStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield Blog_1.default.aggregate([
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
    const todayBlogs = yield Blog_1.default.countDocuments({
        createdAt: { $gte: today }
    });
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekBlogs = yield Blog_1.default.countDocuments({
        createdAt: { $gte: thisWeek }
    });
    (0, response_1.successResponse)(res, Object.assign(Object.assign({}, stats[0]), { todayBlogs,
        weekBlogs }));
}));
//# sourceMappingURL=blogController.js.map