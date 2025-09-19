"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const complaintFeedbackController_1 = require("../controllers/complaintFeedbackController");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Validation rules
const complaintFeedbackValidation = [
    (0, express_validator_1.body)('isGoalStudent').isBoolean().withMessage('Student type is required'),
    (0, express_validator_1.body)('uid').custom((value, { req }) => {
        if (req.body.isGoalStudent && (!value || value.trim() === '')) {
            throw new Error('UID is required for Goal students');
        }
        if (value && value.length > 50) {
            throw new Error('UID cannot exceed 50 characters');
        }
        return true;
    }),
    (0, express_validator_1.body)('rollNo').custom((value, { req }) => {
        if (req.body.isGoalStudent && (!value || value.trim() === '')) {
            throw new Error('Roll number is required for Goal students');
        }
        if (value && value.length > 20) {
            throw new Error('Roll number cannot exceed 20 characters');
        }
        return true;
    }),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    (0, express_validator_1.body)('course').custom((value, { req }) => {
        if (req.body.isGoalStudent && (!value || value.trim() === '')) {
            throw new Error('Course is required for Goal students');
        }
        if (value && value.length > 100) {
            throw new Error('Course cannot exceed 100 characters');
        }
        return true;
    }),
    (0, express_validator_1.body)('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('type').isIn(['complaint', 'feedback', 'suggestion']).withMessage('Type must be complaint, feedback, or suggestion'),
    (0, express_validator_1.body)('department').notEmpty().withMessage('Department is required').isLength({ max: 100 }).withMessage('Department cannot exceed 100 characters'),
    (0, express_validator_1.body)('message').notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
    (0, express_validator_1.body)('attachment').optional().isString().withMessage('Attachment must be a string'),
    (0, express_validator_1.body)('attachmentAlt').optional().isString().isLength({ max: 200 }).withMessage('Attachment alt text cannot exceed 200 characters'),
    (0, express_validator_1.body)('status').optional().isIn(['pending', 'in_review', 'resolved', 'closed']).withMessage('Invalid status')
];
// Public routes (for form submission)
router.post('/', complaintFeedbackController_1.createComplaintFeedback);
// router.post('/', complaintFeedbackValidation, validateRequest, createComplaintFeedback);
// Protected routes (for admin dashboard)
router.use(auth_1.authenticateToken);
router.get('/', complaintFeedbackController_1.getAllComplaintsFeedback);
router.get('/stats', complaintFeedbackController_1.getComplaintFeedbackStats);
router.get('/:id', complaintFeedbackController_1.getComplaintFeedbackById);
router.put('/:id', complaintFeedbackController_1.updateComplaintFeedback);
// router.put('/:id', complaintFeedbackValidation, validateRequest, updateComplaintFeedback);
router.delete('/:id', complaintFeedbackController_1.deleteComplaintFeedback);
exports.default = router;
//# sourceMappingURL=complaintFeedback.js.map