import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { SummerCampService } from "../services/summerCampService";
import { CustomError } from "../middleware/errorHandler";
import SummerCamp from "../models/SummerCamp";

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

// @desc    Download registrations as CSV
// @route   GET /api/summer-camp/download-csv
// @access  Private (Admin)
export const downloadRegistrationsCSV = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { status, search } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
        { studentMobile: { $regex: search, $options: "i" } },
      ];
    }

    const registrations = await SummerCamp.find(query).sort({ createdAt: -1 });

    // CSV headers
    const headers = [
      "Roll Number",
      "GTSE Roll Number",
      "Student Name",
      "DOB",
      "Gender",
      "Category",
      "Father Name",
      "Father Occupation",
      "Student Mobile",
      "Student WhatsApp",
      "Parent Mobile",
      "Parent WhatsApp",
      "Address",
      "Post Office",
      "District",
      "State",
      "Pin Code",
      "Current Class",
      "School Name",
      "School Address",
      "Exam Center",
      "Status",
      "Registered On",
    ];

    // Convert data to CSV format
    const csvData = registrations.map((reg) => [
      reg.rollNumber,
      reg.gtseRollNumber || "",
      reg.studentName,
      reg.dob,
      reg.gender,
      reg.category,
      reg.fatherName,
      reg.fatherOccupation || "",
      reg.studentMobile,
      reg.studentWhatsApp || "",
      reg.parentMobile,
      reg.parentWhatsApp || "",
      reg.address,
      reg.postOffice || "",
      reg.district,
      reg.state,
      reg.pinCode,
      reg.currentClass,
      reg.schoolName,
      reg.schoolAddress || "",
      reg.examCenter,
      reg.status,
      reg.createdAt ? new Date(reg.createdAt).toISOString() : "",
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        row
          .map((field) =>
            typeof field === "string" && (field.includes(",") || field.includes("\n") || field.includes('"'))
              ? `"${field.replace(/"/g, '""')}"`
              : field
          )
          .join(",")
      ),
    ].join("\n");

    // Set response headers for CSV download
    const filename = `summer-camp-registrations-${new Date().toISOString().split("T")[0]}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-cache");

    res.send(csvContent);
  }
);
