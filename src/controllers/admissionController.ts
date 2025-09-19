import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { logger } from "../utils/logger";
import { AdmissionService } from "../services/admissionService";
import { CustomError } from "../middleware/errorHandler";

// @desc    Submit admission enquiry
// @route   POST /api/admission/enquiry
// @access  Public
export const submitEnquiry = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      name,
      email,
      phone,
      course,
      studyLevel,
      address,
      message,
      source
    } = req.body;

    logger.info("Admission enquiry submission attempt", { email, course });

    // Validate required fields
    if (!name || !email || !phone || !course || !studyLevel) {
      throw new CustomError("Please provide all required fields", 400);
    }

    const enquiry = await AdmissionService.createEnquiry({
      name,
      email,
      phone,
      course,
      studyLevel,
      address,
      message,
      source
    });

    ApiResponse.success(
      res,
      enquiry,
      "Admission enquiry submitted successfully. We will contact you soon!",
      201
    );
  }
);

// @desc    Get all admission enquiries (Admin only)
// @route   GET /api/admission/enquiries
// @access  Private
export const getAllEnquiries = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const course = req.query.course as string;

    const result = await AdmissionService.getAllEnquiries(page, limit, status, course);

    ApiResponse.success(res, result, "Enquiries retrieved successfully");
  }
);

// @desc    Get admission enquiry by ID (Admin only)
// @route   GET /api/admission/enquiries/:id
// @access  Private
export const getEnquiryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const enquiry = await AdmissionService.getEnquiryById(id);

    ApiResponse.success(res, enquiry, "Enquiry retrieved successfully");
  }
);

// @desc    Update enquiry status (Admin only)
// @route   PATCH /api/admission/enquiries/:id/status
// @access  Private
export const updateEnquiryStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'contacted', 'enrolled', 'rejected'].includes(status)) {
      throw new CustomError("Please provide a valid status", 400);
    }

    const enquiry = await AdmissionService.updateEnquiryStatus(id, status);

    ApiResponse.success(res, enquiry, "Enquiry status updated successfully");
  }
);

// @desc    Get admission enquiry statistics (Admin only)
// @route   GET /api/admission/stats
// @access  Private
export const getEnquiryStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const stats = await AdmissionService.getEnquiryStats();

    ApiResponse.success(res, stats, "Statistics retrieved successfully");
  }
);

// @desc    Delete admission enquiry (Admin only)
// @route   DELETE /api/admission/enquiries/:id
// @access  Private
export const deleteEnquiry = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    await AdmissionService.deleteEnquiry(id);

    ApiResponse.success(res, null, "Enquiry deleted successfully");
  }
); 