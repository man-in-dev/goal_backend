import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { logger } from "../utils/logger";
import { CareerApplicationService } from "../services/careerApplicationService";
import { CustomError } from "../middleware/errorHandler";

// @desc    Submit career application
// @route   POST /api/career-applications/submit
// @access  Public
export const submitApplication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      fullName,
      email,
      phone,
      position,
      experience,
      education,
      currentCompany,
      expectedSalary,
      skills,
      coverLetter,
      source,
    } = req.body;

    // Handle file upload
    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : undefined;
    const resumeFileName = req.file ? req.file.originalname : undefined;

    logger.info("Career application submission attempt", { email, position });

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !position ||
      !experience ||
      !education ||
      !skills ||
      !coverLetter
    ) {
      throw new CustomError("Please provide all required fields", 400);
    }

    const application = await CareerApplicationService.createApplication({
      fullName,
      email,
      phone,
      position,
      experience,
      education,
      currentCompany,
      expectedSalary,
      skills,
      coverLetter,
      resumeUrl,
      resumeFileName,
      source,
    });

    ApiResponse.success(
      res,
      { applicationId: application._id },
      "Career application submitted successfully. We will review your application and get back to you soon!",
      201
    );
  }
);

// @desc    Get all career applications (Admin only)
// @route   GET /api/career-applications
// @access  Private
export const getAllApplications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const position = req.query.position as string;
    const search = req.query.search as string;

    const result = await CareerApplicationService.getAllApplications(
      page,
      limit,
      status,
      position,
      search
    );

    ApiResponse.success(res, result, "Career applications retrieved successfully");
  }
);

// @desc    Get career application by ID (Admin only)
// @route   GET /api/career-applications/:id
// @access  Private
export const getApplicationById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const application = await CareerApplicationService.getApplicationById(id);

    ApiResponse.success(res, application, "Career application retrieved successfully");
  }
);

// @desc    Update career application status (Admin only)
// @route   PATCH /api/career-applications/:id/status
// @access  Private
export const updateApplicationStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (
      !status ||
      !["pending", "under-review", "shortlisted", "interview-scheduled", "rejected", "hired"].includes(status)
    ) {
      throw new CustomError("Please provide a valid status", 400);
    }

    const application = await CareerApplicationService.updateApplicationStatus(id, status, notes);

    ApiResponse.success(
      res,
      application,
      "Career application status updated successfully"
    );
  }
);

// @desc    Get career application statistics (Admin only)
// @route   GET /api/career-applications/stats
// @access  Private
export const getApplicationStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const stats = await CareerApplicationService.getApplicationStats();

    ApiResponse.success(res, stats, "Statistics retrieved successfully");
  }
);

// @desc    Get recent career applications (Admin only)
// @route   GET /api/career-applications/recent
// @access  Private
export const getRecentApplications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const limit = parseInt(req.query.limit as string) || 5;

    const applications = await CareerApplicationService.getRecentApplications(limit);

    ApiResponse.success(res, applications, "Recent applications retrieved successfully");
  }
);

// @desc    Delete career application (Admin only)
// @route   DELETE /api/career-applications/:id
// @access  Private
export const deleteApplication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    await CareerApplicationService.deleteApplication(id);

    ApiResponse.success(res, null, "Career application deleted successfully");
  }
);
