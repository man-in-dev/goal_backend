import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { logger } from "../utils/logger";
import { CustomError } from "../middleware/errorHandler";
import SummerCampRegistration from "../models/SummerCampRegistration";
import { summerCampSchema } from "../schemas/summerCampSchema";

// @desc    Upload summer camp photo
// @route   POST /api/summer-camp/upload
// @access  Public
export const uploadSummerCampFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.file) {
      throw new CustomError("No file uploaded", 400);
    }

    const fileUrl = `/uploads/summer-camp/${req.file.filename}`;

    ApiResponse.success(
      res,
      { fileUrl },
      "File uploaded successfully",
      200
    );
  }
);

// @desc    Submit Summer Camp Registration
// @route   POST /api/summer-camp/submit
// @access  Public
export const submitSummerCampRegistration = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.info("Summer Camp registration submission attempt", { 
      mobile: req.body.studentMobile 
    });

    // Validate request body
    const validationResult = summerCampSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      throw new CustomError(
        `Validation failed: ${errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`,
        400
      );
    }

    const formData = validationResult.data;

    // Sequential Roll Number Logic (Range: 2026001 to 2035001)
    // In backend, we should check the last one in DB
    if (!formData.rollNumber) {
        const lastRegistration = await SummerCampRegistration.findOne().sort({ rollNumber: -1 });
        let nextRoll = 2026001;
        
        if (lastRegistration && lastRegistration.rollNumber) {
            nextRoll = parseInt(lastRegistration.rollNumber) + 1;
        }
        
        // Ensure within range
        if (nextRoll > 2035001) {
            throw new CustomError("Registration limit reached for Summer Camp", 400);
        }
        
        formData.rollNumber = nextRoll.toString();
    }

    // Check if application already exists with same student mobile
    const existingRegistration = await SummerCampRegistration.findOne({
      studentMobile: formData.studentMobile,
      currentClass: formData.currentClass
    });

    if (existingRegistration) {
      ApiResponse.success(
        res,
        existingRegistration,
        "Registration already exists for this mobile number.",
        200
      );
      return;
    }

    // Create new registration
    const registration = await SummerCampRegistration.create(formData);

    logger.info("Summer Camp registration submitted successfully", {
      id: registration._id,
      rollNumber: registration.rollNumber,
      name: registration.studentName
    });

    ApiResponse.success(
      res,
      registration,
      "Summer Camp registration submitted successfully!",
      201
    );
  }
);

// @desc    Get all registrations (Admin)
// @route   GET /api/summer-camp
// @access  Private
export const getAllRegistrations = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      page = 1,
      limit = 10,
      status,
      search
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { studentMobile: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const [registrations, total] = await Promise.all([
      SummerCampRegistration.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      SummerCampRegistration.countDocuments(filter)
    ]);

    ApiResponse.success(
      res,
      {
        registrations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      },
      "Registrations retrieved successfully",
      200
    );
  }
);

// @desc    Update status
// @route   PATCH /api/summer-camp/:id/status
// @access  Private
export const updateRegistrationStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    const registration = await SummerCampRegistration.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!registration) {
      throw new CustomError("Registration not found", 404);
    }

    ApiResponse.success(res, registration, "Status updated successfully", 200);
  }
);

// @desc    Delete registration
// @route   DELETE /api/summer-camp/:id
// @access  Private
export const deleteRegistration = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await SummerCampRegistration.findByIdAndDelete(req.params.id);
    ApiResponse.success(res, null, "Deleted successfully", 200);
  }
);
