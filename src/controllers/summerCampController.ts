import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { SummerCampService } from "../services/summerCampService";
import { CustomError } from "../middleware/errorHandler";

// @desc    Submit summer camp registration
// @route   POST /api/summer-camp/submit
// @access  Public
export const submitRegistration = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const registrationData = req.body;

    if (!registrationData.studentName || !registrationData.studentMobile) {
      throw new CustomError("Student name and mobile are required", 400);
    }

    const registration = await SummerCampService.createRegistration(registrationData);

    ApiResponse.success(
      res,
      registration,
      "Registration submitted successfully",
      201
    );
  }
);

// @desc    Get all registrations
// @route   GET /api/summer-camp
// @access  Private (Admin)
export const getAllRegistrations = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const result = await SummerCampService.getAllRegistrations(
      page,
      limit,
      status,
      search
    );

    ApiResponse.success(res, result, "Registrations retrieved successfully");
  }
);

// @desc    Get registration by ID
// @route   GET /api/summer-camp/:id
// @access  Private (Admin)
export const getRegistrationById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const registration = await SummerCampService.getRegistrationById(id);

    ApiResponse.success(res, registration, "Registration retrieved successfully");
  }
);

// @desc    Update registration status
// @route   PATCH /api/summer-camp/:id/status
// @access  Private (Admin)
export const updateRegistrationStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new CustomError("Status is required", 400);
    }

    const registration = await SummerCampService.updateStatus(id, status);

    ApiResponse.success(res, registration, "Status updated successfully");
  }
);

// @desc    Delete registration
// @route   DELETE /api/summer-camp/:id
// @access  Private (Admin)
export const deleteRegistration = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await SummerCampService.deleteRegistration(id);

    ApiResponse.success(res, null, "Registration deleted successfully");
  }
);

// @desc    Get stats
// @route   GET /api/summer-camp/stats
// @access  Private (Admin)
export const getStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const stats = await SummerCampService.getStats();
    ApiResponse.success(res, stats, "Statistics retrieved successfully");
  }
);
