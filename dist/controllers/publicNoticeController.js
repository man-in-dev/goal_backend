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
exports.getPublicNoticeStats = exports.deletePublicNotice = exports.updatePublicNotice = exports.createPublicNotice = exports.getPublicNoticeById = exports.getAllPublicNotices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PublicNotice_1 = __importDefault(require("../models/PublicNotice"));
const response_1 = require("../utils/response");
const asyncHandler_1 = require("../utils/asyncHandler");
// @desc    Get all public notices
// @route   GET /api/public-notices
// @access  Public
exports.getAllPublicNotices = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, category, priority, isActive, isPublished, search, sortBy = 'publishDate', sortOrder = 'desc' } = req.query;
    // Build filter object
    const filter = {};
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
        filter.$text = { $search: search };
    }
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Execute query
    const notices = yield PublicNotice_1.default.find(filter)
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean();
    const total = yield PublicNotice_1.default.countDocuments(filter);
    const pagination = {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
    };
    return (0, response_1.successResponse)(res, { notices, pagination }, 'Public notices retrieved successfully');
}));
// @desc    Get single public notice
// @route   GET /api/public-notices/:id
// @access  Public
exports.getPublicNoticeById = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notice = yield PublicNotice_1.default.findById(req.params.id)
        .populate('createdBy', 'name email');
    if (!notice) {
        return (0, response_1.errorResponse)(res, 'Public notice not found', 404);
    }
    return (0, response_1.successResponse)(res, notice, 'Public notice retrieved successfully');
}));
// @desc    Create new public notice
// @route   POST /api/public-notices
// @access  Public (for form submissions) or Private (for admin)
exports.createPublicNotice = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const noticeData = Object.assign(Object.assign({}, req.body), { 
        // If user is authenticated, use their ID, otherwise leave as null
        createdBy: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null });
    const notice = yield PublicNotice_1.default.create(noticeData);
    return (0, response_1.successResponse)(res, notice, 'Public notice created successfully', 201);
}));
// @desc    Update public notice
// @route   PUT /api/public-notices/:id
// @access  Private (Admin only)
exports.updatePublicNotice = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notice = yield PublicNotice_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('createdBy', 'name email');
    if (!notice) {
        return (0, response_1.errorResponse)(res, 'Public notice not found', 404);
    }
    return (0, response_1.successResponse)(res, notice, 'Public notice updated successfully');
}));
// @desc    Delete public notice
// @route   DELETE /api/public-notices/:id
// @access  Private (Admin only)
exports.deletePublicNotice = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notice = yield PublicNotice_1.default.findByIdAndDelete(req.params.id);
    if (!notice) {
        return (0, response_1.errorResponse)(res, 'Public notice not found', 404);
    }
    return (0, response_1.successResponse)(res, null, 'Public notice deleted successfully');
}));
// @desc    Get public notice statistics
// @route   GET /api/public-notices/stats
// @access  Private (Admin + Event Publisher)
exports.getPublicNoticeStats = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // If the user is an event_publisher, limit stats to notices they created.
        // Admin users continue to see global stats.
        const matchStage = [];
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'event_publisher' && req.user.id) {
            matchStage.push({
                $match: { createdBy: new mongoose_1.default.Types.ObjectId(req.user.id) }
            });
        }
        const stats = yield PublicNotice_1.default.aggregate([
            ...matchStage,
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
        const categoryStats = yield PublicNotice_1.default.aggregate([
            ...matchStage,
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
        const priorityStats = yield PublicNotice_1.default.aggregate([
            ...matchStage,
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
        const categoryStatsObj = {};
        categoryStats.forEach((stat) => {
            categoryStatsObj[stat._id] = {
                total: stat.total,
                published: stat.published,
                active: stat.active
            };
        });
        // Convert priority stats to object format
        const priorityStatsObj = {};
        priorityStats.forEach((stat) => {
            priorityStatsObj[stat._id] = {
                total: stat.total,
                published: stat.published,
                active: stat.active
            };
        });
        return (0, response_1.successResponse)(res, Object.assign(Object.assign({}, result), { categoryStats: categoryStatsObj, priorityStats: priorityStatsObj }), 'Public notice statistics retrieved successfully');
    }
    catch (error) {
        console.error('Error fetching public notice stats:', error);
        return (0, response_1.errorResponse)(res, 'Failed to fetch public notice statistics', 500, error);
    }
}));
//# sourceMappingURL=publicNoticeController.js.map