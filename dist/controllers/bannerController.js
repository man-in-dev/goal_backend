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
exports.getBannerStats = exports.recordBannerImpression = exports.recordBannerClick = exports.getActiveBannersByPosition = exports.toggleBannerStatus = exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBannerById = exports.getAllBanners = void 0;
const Banner_1 = __importDefault(require("../models/Banner"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
// Get all banners
exports.getAllBanners = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, position, isActive, search } = req.query;
    const query = {};
    if (position)
        query.position = position;
    if (isActive !== undefined)
        query.isActive = isActive === 'true';
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    const banners = yield Banner_1.default.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));
    const total = yield Banner_1.default.countDocuments(query);
    (0, response_1.successResponse)(res, {
        banners,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total
    });
}));
// Get single banner
exports.getBannerById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield Banner_1.default.findById(req.params.id);
    if (!banner) {
        return (0, response_1.errorResponse)(res, 'Banner not found', 404);
    }
    (0, response_1.successResponse)(res, banner);
}));
// Create new banner
exports.createBanner = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Creating banner with data:', {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        mobileImageUrl: req.body.mobileImageUrl,
        position: req.body.position
    });
    const bannerData = Object.assign(Object.assign({}, req.body), { 
        // Ensure clicks and impressions start at 0
        clicks: 0, impressions: 0 });
    const banner = yield Banner_1.default.create(bannerData);
    console.log('Banner created successfully:', banner._id);
    (0, response_1.successResponse)(res, banner, 'Banner created successfully', 201);
}));
// Update banner
exports.updateBanner = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Updating banner:', req.params.id, 'with data:', {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        mobileImageUrl: req.body.mobileImageUrl,
        position: req.body.position
    });
    const updateData = Object.assign(Object.assign({}, req.body), { 
        // Don't allow updating clicks and impressions directly
        clicks: undefined, impressions: undefined });
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
            delete updateData[key];
        }
    });
    const banner = yield Banner_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!banner) {
        return (0, response_1.errorResponse)(res, 'Banner not found', 404);
    }
    console.log('Banner updated successfully:', banner._id);
    (0, response_1.successResponse)(res, banner, 'Banner updated successfully');
}));
// Delete banner
exports.deleteBanner = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield Banner_1.default.findByIdAndDelete(req.params.id);
    if (!banner) {
        return (0, response_1.errorResponse)(res, 'Banner not found', 404);
    }
    (0, response_1.successResponse)(res, null, 'Banner deleted successfully');
}));
// Toggle banner status
exports.toggleBannerStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield Banner_1.default.findById(req.params.id);
    if (!banner) {
        return (0, response_1.errorResponse)(res, 'Banner not found', 404);
    }
    banner.isActive = !banner.isActive;
    yield banner.save();
    (0, response_1.successResponse)(res, banner, `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`);
}));
// Get active banners by position
exports.getActiveBannersByPosition = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { position } = req.params;
    const { device = 'desktop' } = req.query; // device can be 'desktop' or 'mobile'
    const banners = yield Banner_1.default.find({
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
    (0, response_1.successResponse)(res, transformedBanners);
}));
// Record banner click
exports.recordBannerClick = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield Banner_1.default.findById(req.params.id);
    if (!banner) {
        return (0, response_1.errorResponse)(res, 'Banner not found', 404);
    }
    banner.clicks += 1;
    yield banner.save();
    (0, response_1.successResponse)(res, { clicks: banner.clicks }, 'Click recorded successfully');
}));
// Record banner impression
exports.recordBannerImpression = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield Banner_1.default.findById(req.params.id);
    if (!banner) {
        return (0, response_1.errorResponse)(res, 'Banner not found', 404);
    }
    banner.impressions += 1;
    yield banner.save();
    (0, response_1.successResponse)(res, { impressions: banner.impressions }, 'Impression recorded successfully');
}));
// Get banner statistics
exports.getBannerStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const stats = yield Banner_1.default.aggregate([
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
    const todayBanners = yield Banner_1.default.countDocuments({
        createdAt: { $gte: today }
    });
    (0, response_1.successResponse)(res, Object.assign(Object.assign({}, stats[0]), { todayBanners, ctr: ((_a = stats[0]) === null || _a === void 0 ? void 0 : _a.totalImpressions) > 0 ?
            ((((_b = stats[0]) === null || _b === void 0 ? void 0 : _b.totalClicks) / ((_c = stats[0]) === null || _c === void 0 ? void 0 : _c.totalImpressions)) * 100).toFixed(2) : 0 }));
}));
//# sourceMappingURL=bannerController.js.map