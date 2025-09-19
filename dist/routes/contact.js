"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/submit', contactController_1.submitContact);
// Protected routes (Admin only)
router.get('/forms', auth_1.protect, contactController_1.getAllContacts);
router.get('/forms/:id', auth_1.protect, contactController_1.getContactById);
router.patch('/forms/:id/status', auth_1.protect, contactController_1.updateContactStatus);
router.get('/stats', auth_1.protect, contactController_1.getContactStats);
router.delete('/forms/:id', auth_1.protect, contactController_1.deleteContact);
exports.default = router;
//# sourceMappingURL=contact.js.map