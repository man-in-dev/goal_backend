import { Router } from "express";
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationStats,
  getRecentApplications,
  deleteApplication,
} from "../controllers/careerApplicationController";
import { protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";
import { uploadResume, handleUploadError } from "../middleware/upload";
import { z } from "zod";

const router = Router();

// Validation schemas
const submitApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  position: z.string().min(1, "Position is required"),
  experience: z.string().min(1, "Experience level is required"),
  education: z.string().min(1, "Education level is required"),
  currentCompany: z.string().optional(),
  expectedSalary: z.string().optional(),
  skills: z.string().min(10, "Skills must be at least 10 characters"),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  resumeUrl: z.string().optional(),
  resumeFileName: z.string().optional(),
  source: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "under-review", "shortlisted", "interview-scheduled", "rejected", "hired"]),
  notes: z.string().optional(),
});

// Public routes
router.post("/submit", uploadResume, handleUploadError, validateRequest(submitApplicationSchema), submitApplication);

// Protected routes (Admin only)
router.use(protect); // All routes below require authentication

router.get("/", getAllApplications);
router.get("/stats", getApplicationStats);
router.get("/recent", getRecentApplications);
router.get("/:id", getApplicationById);
router.patch("/:id/status", validateRequest(updateStatusSchema), updateApplicationStatus);
router.delete("/:id", deleteApplication);

export default router;
