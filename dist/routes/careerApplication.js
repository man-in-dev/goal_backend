"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const careerApplicationController_1 = require("../controllers/careerApplicationController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Validation schemas
const submitApplicationSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, "Full name must be at least 2 characters"),
    email: zod_1.z.string().email("Please enter a valid email address"),
    phone: zod_1.z.string().min(10, "Phone number must be at least 10 digits"),
    position: zod_1.z.string().min(1, "Position is required"),
    experience: zod_1.z.string().min(1, "Experience level is required"),
    education: zod_1.z.string().min(1, "Education level is required"),
    currentCompany: zod_1.z.string().optional(),
    expectedSalary: zod_1.z.string().optional(),
    skills: zod_1.z.string().min(10, "Skills must be at least 10 characters"),
    coverLetter: zod_1.z.string().min(50, "Cover letter must be at least 50 characters"),
    resumeUrl: zod_1.z.string().optional(),
    resumeFileName: zod_1.z.string().optional(),
    source: zod_1.z.string().optional(),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["pending", "under-review", "shortlisted", "interview-scheduled", "rejected", "hired"]),
    notes: zod_1.z.string().optional(),
});
// Public routes
router.post("/submit", upload_1.uploadResume, upload_1.handleUploadError, (0, validation_1.validateRequest)(submitApplicationSchema), careerApplicationController_1.submitApplication);
// Protected routes (Admin only)
router.use(auth_1.protect); // All routes below require authentication
router.get("/", careerApplicationController_1.getAllApplications);
router.get("/stats", careerApplicationController_1.getApplicationStats);
router.get("/recent", careerApplicationController_1.getRecentApplications);
router.get("/:id", careerApplicationController_1.getApplicationById);
router.patch("/:id/status", (0, validation_1.validateRequest)(updateStatusSchema), careerApplicationController_1.updateApplicationStatus);
router.delete("/:id", careerApplicationController_1.deleteApplication);
exports.default = router;
//# sourceMappingURL=careerApplication.js.map