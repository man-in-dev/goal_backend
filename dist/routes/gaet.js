"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gaetController_1 = require("../controllers/gaetController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/submit', gaetController_1.submitGAET);
router.get('/registration/:registrationNumber', gaetController_1.getGAETFormByRegistrationNumber);
// Protected routes (Admin only)
router.get('/forms', auth_1.protect, gaetController_1.getAllGAETForms);
router.get('/forms/:id', auth_1.protect, gaetController_1.getGAETFormById);
router.patch('/forms/:id/status', auth_1.protect, gaetController_1.updateGAETFormStatus);
router.get('/stats', auth_1.protect, gaetController_1.getGAETStats);
router.delete('/forms/:id', auth_1.protect, gaetController_1.deleteGAETForm);
exports.default = router;
//# sourceMappingURL=gaet.js.map