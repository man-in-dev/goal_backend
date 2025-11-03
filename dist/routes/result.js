"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resultController_1 = require("../controllers/resultController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Validation rules
const resultValidation = [
    (0, express_validator_1.body)('course').notEmpty().withMessage('Course is required'),
    (0, express_validator_1.body)('testDate').isISO8601().withMessage('Valid test date is required'),
    (0, express_validator_1.body)('rank').isInt({ min: 1 }).withMessage('Valid rank is required'),
    (0, express_validator_1.body)('rollNo').notEmpty().withMessage('Roll number is required'),
    (0, express_validator_1.body)('studentName').notEmpty().withMessage('Student name is required'),
    (0, express_validator_1.body)('tq').isInt({ min: 0 }).withMessage('Total questions must be a non-negative integer'),
    (0, express_validator_1.body)('ta').isInt({ min: 0 }).withMessage('Total attempted must be a non-negative integer'),
    (0, express_validator_1.body)('tr').isInt({ min: 0 }).withMessage('Total right must be a non-negative integer'),
    (0, express_validator_1.body)('tw').isInt({ min: 0 }).withMessage('Total wrong must be a non-negative integer'),
    (0, express_validator_1.body)('tl').isInt({ min: 0 }).withMessage('Total left must be a non-negative integer'),
    (0, express_validator_1.body)('pr').isInt({ min: 0 }).withMessage('Physics right must be a non-negative integer'),
    (0, express_validator_1.body)('pw').isInt({ min: 0 }).withMessage('Physics wrong must be a non-negative integer'),
    (0, express_validator_1.body)('cr').isInt({ min: 0 }).withMessage('Chemistry right must be a non-negative integer'),
    (0, express_validator_1.body)('cw').isInt({ min: 0 }).withMessage('Chemistry wrong must be a non-negative integer'),
    (0, express_validator_1.body)('br').isInt({ min: 0 }).withMessage('Biology right must be a non-negative integer'),
    (0, express_validator_1.body)('bw').isInt({ min: 0 }).withMessage('Biology wrong must be a non-negative integer'),
    (0, express_validator_1.body)('totalMarks').isFloat({ min: 0 }).withMessage('Total marks must be a non-negative number'),
    (0, express_validator_1.body)('marksPercentage').isFloat({ min: 0, max: 100 }).withMessage('Marks percentage must be between 0 and 100'),
    (0, express_validator_1.body)('wPercentage').isFloat({ min: 0, max: 100 }).withMessage('Wrong percentage must be between 0 and 100'),
    (0, express_validator_1.body)('percentile').isFloat({ min: 0, max: 100 }).withMessage('Percentile must be between 0 and 100'),
    (0, express_validator_1.body)('batch').notEmpty().withMessage('Batch is required'),
    (0, express_validator_1.body)('branch').notEmpty().withMessage('Branch is required'),
    (0, express_validator_1.body)('uploadedBy').notEmpty().withMessage('Uploaded by is required')
];
// Public routes
router.get('/course/:course', resultController_1.getResultsByCourse);
router.get('/batch/:batch', resultController_1.getResultsByBatch);
// Protected routes (for admin dashboard)
router.use(auth_1.authenticateToken);
router.get('/', resultController_1.getAllResults);
router.get('/stats', resultController_1.getResultStats);
router.post('/', resultValidation, validation_1.validateRequest, resultController_1.createResult);
router.post('/upload-csv', resultController_1.upload.single('csvFile'), resultController_1.uploadCSVResults);
router.delete('/multiple', resultController_1.deleteMultipleResults); // Must be before /:id route
router.get('/:id', resultController_1.getResultById);
router.put('/:id', resultValidation, validation_1.validateRequest, resultController_1.updateResult);
router.delete('/:id', resultController_1.deleteResult);
exports.default = router;
//# sourceMappingURL=result.js.map