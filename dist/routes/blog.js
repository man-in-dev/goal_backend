"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Validation rules
const blogValidation = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required'),
    (0, express_validator_1.body)('excerpt').optional().isString().isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
    (0, express_validator_1.body)('featuredImage').optional().isURL().withMessage('Please provide a valid image URL'),
    (0, express_validator_1.body)('imageAlt').optional().isString().isLength({ max: 200 }).withMessage('Image alt text cannot exceed 200 characters'),
    (0, express_validator_1.body)('author').notEmpty().withMessage('Author is required').isLength({ max: 100 }).withMessage('Author name cannot exceed 100 characters'),
    (0, express_validator_1.body)('category').isIn(['education', 'career', 'technology', 'lifestyle', 'general']).withMessage('Invalid category'),
    (0, express_validator_1.body)('tags').optional().isArray().withMessage('Tags must be an array'),
    (0, express_validator_1.body)('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
    (0, express_validator_1.body)('publishDate').optional().isISO8601().withMessage('Please provide a valid publish date'),
    (0, express_validator_1.body)('metaTitle').optional().isString().isLength({ max: 60 }).withMessage('Meta title cannot exceed 60 characters'),
    (0, express_validator_1.body)('metaDescription').optional().isString().isLength({ max: 160 }).withMessage('Meta description cannot exceed 160 characters'),
    (0, express_validator_1.body)('seoKeywords').optional().isArray().withMessage('SEO keywords must be an array'),
    (0, express_validator_1.body)('createdBy').notEmpty().withMessage('Created by is required')
];
// Public routes
router.get('/', blogController_1.getAllBlogs);
router.get('/featured', blogController_1.getFeaturedBlogs);
router.get('/recent', blogController_1.getRecentBlogs);
router.get('/category', blogController_1.getBlogsByCategory);
router.get('/tags', blogController_1.getBlogsByTags);
router.get('/popular', blogController_1.getPopularBlogs);
router.get('/slug/:slug', blogController_1.getBlogBySlug);
router.post('/:id/like', blogController_1.toggleBlogLike);
router.post('/:id/view', blogController_1.incrementBlogView);
// Protected routes (for admin dashboard)
router.use(auth_1.authenticateToken);
router.get('/stats', blogController_1.getBlogStats);
router.get('/:id', blogController_1.getBlogById);
// router.post('/', blogValidation, validateRequest, createBlog);
router.post('/', blogController_1.createBlog);
// router.put('/:id', blogValidation, validateRequest, updateBlog);
router.put('/:id', blogController_1.updateBlog);
router.delete('/:id', blogController_1.deleteBlog);
router.patch('/:id/toggle-publish', blogController_1.toggleBlogPublish);
router.patch('/:id/toggle-featured', blogController_1.toggleBlogFeatured);
exports.default = router;
//# sourceMappingURL=blog.js.map