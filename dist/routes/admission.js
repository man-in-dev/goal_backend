"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admissionController_1 = require("../controllers/admissionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/enquiry', admissionController_1.submitEnquiry);
// Protected routes (Admin only)
router.get('/enquiries', auth_1.protect, admissionController_1.getAllEnquiries);
router.get('/enquiries/:id', auth_1.protect, admissionController_1.getEnquiryById);
router.patch('/enquiries/:id/status', auth_1.protect, admissionController_1.updateEnquiryStatus);
router.get('/stats', auth_1.protect, admissionController_1.getEnquiryStats);
router.delete('/enquiries/:id', auth_1.protect, admissionController_1.deleteEnquiry);
exports.default = router;
//# sourceMappingURL=admission.js.map