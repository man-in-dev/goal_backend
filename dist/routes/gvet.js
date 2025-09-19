"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gvetController_1 = require("../controllers/gvetController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/submit', gvetController_1.submitGVET);
router.get('/registration/:registrationNumber', gvetController_1.getGVETFormByRegistrationNumber);
// Protected routes (Admin only)
router.get('/forms', auth_1.protect, gvetController_1.getAllGVETForms);
router.get('/forms/:id', auth_1.protect, gvetController_1.getGVETFormById);
router.patch('/forms/:id/status', auth_1.protect, gvetController_1.updateGVETFormStatus);
router.get('/stats', auth_1.protect, gvetController_1.getGVETStats);
router.delete('/forms/:id', auth_1.protect, gvetController_1.deleteGVETForm);
exports.default = router;
//# sourceMappingURL=gvet.js.map