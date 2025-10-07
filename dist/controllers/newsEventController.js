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
exports.incrementNewsEventShare = exports.toggleNewsEventLike = exports.getNewsEventStats = exports.getNewsEventsByTags = exports.getRecentNewsEvents = exports.deleteNewsEvent = exports.updateNewsEvent = exports.createNewsEvent = exports.getNewsEventById = exports.getAllNewsEvents = void 0;
const NewsEvent_1 = __importDefault(require("../models/NewsEvent"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
// Get all news and events
exports.getAllNewsEvents = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, type, category, 
    // isPublished,
    isFeatured, search, sortBy = 'publishDate', sortOrder = 'desc' } = req.query;
    const query = {};
    // Filter for published news events by default for public access
    // if (isPublished !== undefined) {
    //   query.isPublished = isPublished === 'true';
    // } else {
    //   // Default to published only for public access
    //   query.isPublished = true;
    // }
    if (type)
        query.type = type;
    if (category)
        query.category = category;
    if (isFeatured !== undefined)
        query.isFeatured = isFeatured === 'true';
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { excerpt: { $regex: search, $options: 'i' } }
        ];
    }
    // Build sort object
    const sortObj = {};
    if (sortBy === 'publishDate') {
        sortObj.publishDate = sortOrder === 'asc' ? 1 : -1;
    }
    else if (sortBy === 'createdAt') {
        sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
    }
    else if (sortBy === 'views') {
        sortObj.views = sortOrder === 'asc' ? 1 : -1;
    }
    else {
        sortObj.publishDate = -1;
        sortObj.createdAt = -1;
    }
    const newsEvents = yield NewsEvent_1.default.find(query)
        .sort(sortObj)
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));
    const total = yield NewsEvent_1.default.countDocuments(query);
    (0, response_1.successResponse)(res, {
        newsEvents,
        pagination: {
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total,
            limit: Number(limit)
        }
    });
}));
// Get single news/event
exports.getNewsEventById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsEvent = yield NewsEvent_1.default.findById(req.params.id);
    if (!newsEvent) {
        return (0, response_1.errorResponse)(res, 'News/Event not found', 404);
    }
    (0, response_1.successResponse)(res, newsEvent);
}));
// Create new news/event
exports.createNewsEvent = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsEvent = yield NewsEvent_1.default.create(req.body);
    (0, response_1.successResponse)(res, newsEvent, 'News/Event created successfully', 201);
}));
// Update news/event
exports.updateNewsEvent = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsEvent = yield NewsEvent_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!newsEvent) {
        return (0, response_1.errorResponse)(res, 'News/Event not found', 404);
    }
    (0, response_1.successResponse)(res, newsEvent, 'News/Event updated successfully');
}));
// Delete news/event
exports.deleteNewsEvent = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsEvent = yield NewsEvent_1.default.findByIdAndDelete(req.params.id);
    if (!newsEvent) {
        return (0, response_1.errorResponse)(res, 'News/Event not found', 404);
    }
    (0, response_1.successResponse)(res, null, 'News/Event deleted successfully');
}));
// Get recent news/events
exports.getRecentNewsEvents = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 5, type } = req.query;
    const query = { isPublished: true };
    if (type)
        query.type = type;
    const newsEvents = yield NewsEvent_1.default.find(query)
        .sort({ publishDate: -1, createdAt: -1 })
        .limit(Number(limit));
    (0, response_1.successResponse)(res, newsEvents);
}));
// Get news/events by tags
exports.getNewsEventsByTags = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tags } = req.query;
    if (!tags) {
        return (0, response_1.errorResponse)(res, 'Tags parameter is required', 400);
    }
    const tagArray = Array.isArray(tags) ? tags : [tags];
    const newsEvents = yield NewsEvent_1.default.find({
        isPublished: true,
        tags: { $in: tagArray }
    })
        .sort({ publishDate: -1 })
        .limit(10);
    (0, response_1.successResponse)(res, newsEvents);
}));
// Get news/event statistics
exports.getNewsEventStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield NewsEvent_1.default.aggregate([
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
    const todayNewsEvents = yield NewsEvent_1.default.countDocuments({
        createdAt: { $gte: today }
    });
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekNewsEvents = yield NewsEvent_1.default.countDocuments({
        createdAt: { $gte: thisWeek }
    });
    (0, response_1.successResponse)(res, Object.assign(Object.assign({}, stats[0]), { todayNewsEvents,
        weekNewsEvents }));
}));
// Toggle like for a news/event
exports.toggleNewsEventLike = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsEvent = yield NewsEvent_1.default.findById(req.params.id);
    if (!newsEvent) {
        return (0, response_1.errorResponse)(res, 'News/Event not found', 404);
    }
    // For now, we'll just increment/decrement likes
    // In a real application, you might want to track which users liked which news/events
    const { action } = req.body; // 'like' or 'unlike'
    if (action === 'like') {
        newsEvent.likes += 1;
    }
    else if (action === 'unlike') {
        newsEvent.likes = Math.max(0, newsEvent.likes - 1);
    }
    else {
        return (0, response_1.errorResponse)(res, 'Invalid action. Use "like" or "unlike"', 400);
    }
    yield newsEvent.save();
    (0, response_1.successResponse)(res, {
        likes: newsEvent.likes,
        action: action
    }, `News/Event ${action}d successfully`);
}));
// Increment share count for a news/event
exports.incrementNewsEventShare = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsEvent = yield NewsEvent_1.default.findById(req.params.id);
    if (!newsEvent) {
        return (0, response_1.errorResponse)(res, 'News/Event not found', 404);
    }
    newsEvent.shares += 1;
    yield newsEvent.save();
    (0, response_1.successResponse)(res, {
        shares: newsEvent.shares
    }, 'Share count incremented successfully');
}));
//# sourceMappingURL=newsEventController.js.map