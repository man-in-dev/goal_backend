"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bannerController_1 = require("../controllers/bannerController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Validation rules
const bannerValidation = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    (0, express_validator_1.body)('description').optional().isString().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    (0, express_validator_1.body)('imageUrl').notEmpty().withMessage('Image URL is required'),
    (0, express_validator_1.body)('imageAlt').notEmpty().withMessage('Image alt text is required').isLength({ max: 200 }).withMessage('Alt text cannot exceed 200 characters'),
    (0, express_validator_1.body)('mobileImageUrl').optional().isString().withMessage('Mobile image URL must be a string'),
    (0, express_validator_1.body)('mobileImageAlt').optional().isString().isLength({ max: 200 }).withMessage('Mobile alt text cannot exceed 200 characters'),
    (0, express_validator_1.body)('linkUrl').optional().isURL().withMessage('Please provide a valid URL'),
    (0, express_validator_1.body)('position').isIn(['hero', 'sidebar', 'footer', 'popup', 'announcement']).withMessage('Invalid position'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('priority').optional().isInt({ min: 0, max: 100 }).withMessage('Priority must be between 0 and 100'),
    (0, express_validator_1.body)('targetAudience').optional().isArray().withMessage('Target audience must be an array'),
    (0, express_validator_1.body)('createdBy').notEmpty().withMessage('Created by is required')
];
// Public routes
router.get('/active/:position', bannerController_1.getActiveBannersByPosition);
router.post('/:id/click', bannerController_1.recordBannerClick);
router.post('/:id/impression', bannerController_1.recordBannerImpression);
// Protected routes (for admin dashboard)
router.use(auth_1.authenticateToken);
router.get('/', bannerController_1.getAllBanners);
router.get('/stats', bannerController_1.getBannerStats);
router.get('/:id', bannerController_1.getBannerById);
// router.post('/', bannerValidation, validateRequest, createBanner);
router.post('/', bannerController_1.createBanner);
router.put('/:id', bannerValidation, validation_1.validateRequest, bannerController_1.updateBanner);
router.delete('/:id', bannerController_1.deleteBanner);
router.patch('/:id/toggle-status', bannerController_1.toggleBannerStatus);
exports.default = router;
//# sourceMappingURL=banner.js.map