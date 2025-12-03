"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const publicNoticeController_1 = require("../controllers/publicNoticeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation rules
const publicNoticeValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot be more than 200 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 2000 })
        .withMessage('Description cannot be more than 2000 characters'),
    (0, express_validator_1.body)('publishDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid publish date'),
    (0, express_validator_1.body)('downloadLink')
        .optional()
        .isURL()
        .withMessage('Please provide a valid download link'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('isPublished')
        .optional()
        .isBoolean()
        .withMessage('isPublished must be a boolean'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    (0, express_validator_1.body)('category')
        .optional()
        .isIn(['exam', 'admission', 'general', 'academic', 'other'])
        .withMessage('Category must be exam, admission, general, academic, or other'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .isString()
        .trim()
        .withMessage('Each tag must be a string')
];
// Public routes
router.get('/', publicNoticeController_1.getAllPublicNotices);
router.get('/stats', auth_1.protect, (0, auth_1.authorize)('admin', 'event_publisher'), publicNoticeController_1.getPublicNoticeStats);
router.get('/:id', publicNoticeController_1.getPublicNoticeById);
// Protected routes (Admin + Event Publisher)
// router.post('/', protect, authorize('admin', 'event_publisher'), publicNoticeValidation, validateRequest, createPublicNotice);
router.post('/', auth_1.protect, (0, auth_1.authorize)('admin', 'event_publisher'), publicNoticeController_1.createPublicNotice);
router.put('/:id', auth_1.protect, (0, auth_1.authorize)('admin', 'event_publisher'), publicNoticeController_1.updatePublicNotice);
// router.put('/:id', protect, authorize('admin', 'event_publisher'), publicNoticeValidation, validateRequest, updatePublicNotice);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)('admin', 'event_publisher'), publicNoticeController_1.deletePublicNotice);
exports.default = router;
//# sourceMappingURL=publicNotice.js.map