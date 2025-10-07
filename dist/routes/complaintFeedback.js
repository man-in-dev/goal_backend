"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const complaintFeedbackController_1 = require("../controllers/complaintFeedbackController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const complaintFeedbackSchema_1 = require("../schemas/complaintFeedbackSchema");
const commonSchemas_1 = require("../schemas/commonSchemas");
const router = express_1.default.Router();
// Public routes (for form submission)
router.post('/', (0, validation_1.validateRequest)(complaintFeedbackSchema_1.complaintFeedbackSchema), complaintFeedbackController_1.createComplaintFeedback);
// Protected routes (for admin dashboard)
router.use(auth_1.authenticateToken);
router.get('/', (0, validation_1.validateQuery)(commonSchemas_1.complaintQuerySchema), complaintFeedbackController_1.getAllComplaintsFeedback);
router.get('/stats', complaintFeedbackController_1.getComplaintFeedbackStats);
router.get('/download-csv', (0, validation_1.validateQuery)(commonSchemas_1.complaintCSVQuerySchema), complaintFeedbackController_1.downloadComplaintsFeedbackCSV);
router.get('/:id', (0, validation_1.validateParams)(zod_1.z.object({ id: commonSchemas_1.objectIdSchema })), complaintFeedbackController_1.getComplaintFeedbackById);
router.put('/:id', (0, validation_1.validateParams)(zod_1.z.object({ id: commonSchemas_1.objectIdSchema })), (0, validation_1.validateRequest)(complaintFeedbackSchema_1.updateComplaintFeedbackSchema), complaintFeedbackController_1.updateComplaintFeedback);
router.delete('/:id', (0, validation_1.validateParams)(zod_1.z.object({ id: commonSchemas_1.objectIdSchema })), complaintFeedbackController_1.deleteComplaintFeedback);
exports.default = router;
//# sourceMappingURL=complaintFeedback.js.map