"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsEventController_1 = require("../controllers/newsEventController");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Validation rules for creating
const createNewsEventValidation = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required'),
    (0, express_validator_1.body)('excerpt').optional().isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
    (0, express_validator_1.body)('type').isIn(['news', 'event', 'announcement', 'achievement']).withMessage('Invalid type'),
    (0, express_validator_1.body)('category').isIn(['academic', 'sports', 'cultural', 'achievement', 'general']).withMessage('Invalid category'),
    (0, express_validator_1.body)('author').notEmpty().withMessage('Author is required'),
    (0, express_validator_1.body)('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
    (0, express_validator_1.body)('publishDate').optional().isISO8601().withMessage('Please provide a valid publish date'),
    (0, express_validator_1.body)('publishTime').optional().isString().withMessage('Publish time must be a string'),
    (0, express_validator_1.body)('location').optional().isString().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
    (0, express_validator_1.body)('expiryDate').optional().isISO8601().withMessage('Please provide a valid expiry date'),
    (0, express_validator_1.body)('tags').optional().isArray().withMessage('Tags must be an array'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('likes').optional().isInt({ min: 0 }).withMessage('Likes must be a non-negative integer'),
    (0, express_validator_1.body)('shares').optional().isInt({ min: 0 }).withMessage('Shares must be a non-negative integer'),
    (0, express_validator_1.body)('metaTitle').optional().isLength({ max: 200 }).withMessage('Meta title cannot exceed 200 characters'),
    (0, express_validator_1.body)('metaDescription').optional().isLength({ max: 300 }).withMessage('Meta description cannot exceed 300 characters'),
    (0, express_validator_1.body)('slug').notEmpty().withMessage('Slug is required'),
    (0, express_validator_1.body)('createdBy').notEmpty().withMessage('Created by is required')
];
// Validation rules for updating
const updateNewsEventValidation = [
    (0, express_validator_1.body)('title').optional().isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    (0, express_validator_1.body)('content').optional(),
    (0, express_validator_1.body)('excerpt').optional().isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
    (0, express_validator_1.body)('type').optional().isIn(['news', 'event', 'announcement', 'achievement']).withMessage('Invalid type'),
    (0, express_validator_1.body)('category').optional().isIn(['academic', 'sports', 'cultural', 'achievement', 'general']).withMessage('Invalid category'),
    (0, express_validator_1.body)('author').optional(),
    (0, express_validator_1.body)('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
    (0, express_validator_1.body)('publishDate').optional().isISO8601().withMessage('Please provide a valid publish date'),
    (0, express_validator_1.body)('publishTime').optional().isString().withMessage('Publish time must be a string'),
    (0, express_validator_1.body)('location').optional().isString().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
    (0, express_validator_1.body)('expiryDate').optional().isISO8601().withMessage('Please provide a valid expiry date'),
    (0, express_validator_1.body)('tags').optional().isArray().withMessage('Tags must be an array'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('likes').optional().isInt({ min: 0 }).withMessage('Likes must be a non-negative integer'),
    (0, express_validator_1.body)('shares').optional().isInt({ min: 0 }).withMessage('Shares must be a non-negative integer'),
    (0, express_validator_1.body)('metaTitle').optional().isLength({ max: 200 }).withMessage('Meta title cannot exceed 200 characters'),
    (0, express_validator_1.body)('metaDescription').optional().isLength({ max: 300 }).withMessage('Meta description cannot exceed 300 characters'),
    (0, express_validator_1.body)('slug').optional()
];
// Public routes
router.get('/', newsEventController_1.getAllNewsEvents);
router.get('/recent', newsEventController_1.getRecentNewsEvents);
router.get('/tags', newsEventController_1.getNewsEventsByTags);
router.post('/:id/like', newsEventController_1.toggleNewsEventLike);
router.post('/:id/share', newsEventController_1.incrementNewsEventShare);
// Protected routes (for admin dashboard)
router.use(auth_1.authenticateToken);
router.get('/stats', newsEventController_1.getNewsEventStats);
router.get('/:id', newsEventController_1.getNewsEventById);
// router.post('/', createNewsEventValidation, validateRequest, createNewsEvent);
router.post('/', newsEventController_1.createNewsEvent);
// router.put('/:id', updateNewsEventValidation, validateRequest, updateNewsEvent);
router.put('/:id', newsEventController_1.updateNewsEvent);
router.delete('/:id', newsEventController_1.deleteNewsEvent);
exports.default = router;
//# sourceMappingURL=newsEvent.js.map