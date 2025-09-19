"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enquiryController_1 = require("../controllers/enquiryController");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Validation rules - flexible to support different form types
const enquiryValidation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    (0, express_validator_1.body)('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('studying').optional().isLength({ max: 100 }).withMessage('Studying field cannot exceed 100 characters'),
    (0, express_validator_1.body)('studyLevel').optional().isLength({ max: 100 }).withMessage('Study level cannot exceed 100 characters'),
    (0, express_validator_1.body)('course').notEmpty().withMessage('Course is required').isLength({ max: 100 }).withMessage('Course cannot exceed 100 characters'),
    (0, express_validator_1.body)('state').optional().isLength({ max: 50 }).withMessage('State cannot exceed 50 characters'),
    (0, express_validator_1.body)('district').optional().isLength({ max: 50 }).withMessage('District cannot exceed 50 characters'),
    (0, express_validator_1.body)('address').optional().isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),
    (0, express_validator_1.body)('query').optional().isLength({ max: 1000 }).withMessage('Query cannot exceed 1000 characters'),
    (0, express_validator_1.body)('message').optional().isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
    (0, express_validator_1.body)('countryCode').optional().isLength({ max: 5 }).withMessage('Country code cannot exceed 5 characters'),
    (0, express_validator_1.body)('source').optional().isLength({ max: 50 }).withMessage('Source cannot exceed 50 characters'),
    (0, express_validator_1.body)('status').optional().isIn(['pending', 'contacted', 'resolved', 'closed']).withMessage('Invalid status')
];
// Public routes (for form submission)
// router.post('/', enquiryValidation, validateRequest, createEnquiry);
router.post('/', enquiryController_1.createEnquiry);
// Protected routes (for admin dashboard)
router.use(auth_1.authenticateToken);
router.get('/', enquiryController_1.getAllEnquiries);
router.get('/stats', enquiryController_1.getEnquiryStats);
router.get('/:id', enquiryController_1.getEnquiryById);
// router.put('/:id', enquiryValidation, validateRequest, updateEnquiry);
router.put('/:id', enquiryController_1.updateEnquiry);
router.delete('/:id', enquiryController_1.deleteEnquiry);
exports.default = router;
//# sourceMappingURL=enquiry.js.map