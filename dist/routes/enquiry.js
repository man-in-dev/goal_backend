"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const enquiryController_1 = require("../controllers/enquiryController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const enquirySchema_1 = require("../schemas/enquirySchema");
const commonSchemas_1 = require("../schemas/commonSchemas");
const router = express_1.default.Router();
// Public routes (for form submission)
router.post('/', (0, validation_1.validateRequest)(enquirySchema_1.enquiryFormSchema), enquiryController_1.createEnquiry);
// Protected routes (for admin dashboard)
router.use(auth_1.authenticateToken);
router.get('/', (0, validation_1.validateQuery)(commonSchemas_1.enquiryQuerySchema), enquiryController_1.getAllEnquiries);
router.get('/stats', enquiryController_1.getEnquiryStats);
router.get('/download-csv', (0, validation_1.validateQuery)(commonSchemas_1.enquiryCSVQuerySchema), enquiryController_1.downloadEnquiriesCSV);
router.get('/:id', (0, validation_1.validateParams)(zod_1.z.object({ id: commonSchemas_1.objectIdSchema })), enquiryController_1.getEnquiryById);
router.put('/:id', (0, validation_1.validateParams)(zod_1.z.object({ id: commonSchemas_1.objectIdSchema })), (0, validation_1.validateRequest)(enquirySchema_1.updateEnquirySchema), enquiryController_1.updateEnquiry);
router.delete('/:id', (0, validation_1.validateParams)(zod_1.z.object({ id: commonSchemas_1.objectIdSchema })), enquiryController_1.deleteEnquiry);
exports.default = router;
//# sourceMappingURL=enquiry.js.map