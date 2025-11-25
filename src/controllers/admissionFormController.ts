import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { logger } from "../utils/logger";
import { CustomError } from "../middleware/errorHandler";
import AdmissionForm from "../models/AdmissionForm";
import { admissionFormSchema } from "../schemas/admissionFormSchema";

// @desc    Upload admission form files
// @route   POST /api/admission-form/upload
// @access  Public
export const uploadAdmissionFiles = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const files = req.files as {
      passportPhoto?: Express.Multer.File[];
      reportCard?: Express.Multer.File[];
      birthCertificate?: Express.Multer.File[];
      idProof?: Express.Multer.File[];
    } | undefined;
    const fileUrls: any = {};

    if (files) {
      if (files.passportPhoto && files.passportPhoto[0]) {
        fileUrls.passportPhoto = `/uploads/admission-forms/${files.passportPhoto[0].filename}`;
      }
      if (files.reportCard && files.reportCard[0]) {
        fileUrls.reportCard = `/uploads/admission-forms/${files.reportCard[0].filename}`;
      }
      if (files.birthCertificate && files.birthCertificate[0]) {
        fileUrls.birthCertificate = `/uploads/admission-forms/${files.birthCertificate[0].filename}`;
      }
      if (files.idProof && files.idProof[0]) {
        fileUrls.idProof = `/uploads/admission-forms/${files.idProof[0].filename}`;
      }
    }

    ApiResponse.success(
      res,
      fileUrls,
      "Files uploaded successfully",
      200
    );
  }
);

// @desc    Submit online admission form
// @route   POST /api/admission-form/submit
// @access  Public
export const submitAdmissionForm = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.info("Admission form submission attempt", { 
      email: req.body.email,
      phone: req.body.phone 
    });

    // Handle file uploads if present
    const files = req.files as {
      passportPhoto?: Express.Multer.File[];
      reportCard?: Express.Multer.File[];
      birthCertificate?: Express.Multer.File[];
      idProof?: Express.Multer.File[];
    } | undefined;
    if (files) {
      if (files.passportPhoto && files.passportPhoto[0]) {
        req.body.passportPhoto = `/uploads/admission-forms/${files.passportPhoto[0].filename}`;
      }
      if (files.reportCard && files.reportCard[0]) {
        req.body.reportCard = `/uploads/admission-forms/${files.reportCard[0].filename}`;
      }
      if (files.birthCertificate && files.birthCertificate[0]) {
        req.body.birthCertificate = `/uploads/admission-forms/${files.birthCertificate[0].filename}`;
      }
      if (files.idProof && files.idProof[0]) {
        req.body.idProof = `/uploads/admission-forms/${files.idProof[0].filename}`;
      }
    }

    // Convert FormData string values to proper types
    // FormData sends all values as strings, so we need to convert booleans
    if (req.body.declarationAccepted !== undefined) {
      if (typeof req.body.declarationAccepted === 'string') {
        req.body.declarationAccepted = req.body.declarationAccepted === 'true' || req.body.declarationAccepted === '1';
      }
    }

    // Validate request body
    const validationResult = admissionFormSchema.safeParse(req.body);
    
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

    // Check if application already exists with same email or phone
    const existingApplication = await AdmissionForm.findOne({
      $or: [
        { email: formData.email },
        { phone: formData.phone }
      ]
    });

    if (existingApplication) {
      logger.warn("Duplicate admission form submission attempt", {
        email: formData.email,
        phone: formData.phone,
        existingId: existingApplication._id
      });
      
      // Return existing application instead of error (allow resubmission)
      ApiResponse.success(
        res,
        existingApplication,
        "Application found. You can track your application status.",
        200
      );
      return;
    }

    // Create new admission form
    const admissionForm = await AdmissionForm.create(formData);

    logger.info("Admission form submitted successfully", {
      id: admissionForm._id,
      email: admissionForm.email,
      name: admissionForm.name
    });

    ApiResponse.success(
      res,
      admissionForm,
      "Admission application submitted successfully! We will contact you soon.",
      201
    );
  }
);

// @desc    Get admission form by ID
// @route   GET /api/admission-form/:id
// @access  Public (can be made private later)
export const getAdmissionForm = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const admissionForm = await AdmissionForm.findById(id);

    if (!admissionForm) {
      throw new CustomError("Admission form not found", 404);
    }

    ApiResponse.success(
      res,
      admissionForm,
      "Admission form retrieved successfully",
      200
    );
  }
);

// @desc    Get all admission forms (with pagination and filters)
// @route   GET /api/admission-form
// @access  Private (should be protected with admin auth)
export const getAllAdmissionForms = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      page = 1,
      limit = 10,
      status,
      classSeekingAdmission,
      search
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (classSeekingAdmission) {
      filter.classSeekingAdmission = classSeekingAdmission;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { applicationNo: { $regex: search, $options: 'i' } }
      ];
    }

    const [admissionForms, total] = await Promise.all([
      AdmissionForm.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AdmissionForm.countDocuments(filter)
    ]);

    ApiResponse.success(
      res,
      {
        admissionForms,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      },
      "Admission forms retrieved successfully",
      200
    );
  }
);

// @desc    Update admission form status
// @route   PATCH /api/admission-form/:id/status
// @access  Private (should be protected with admin auth)
export const updateAdmissionFormStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'admitted'];
    
    if (!status || !validStatuses.includes(status)) {
      throw new CustomError(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        400
      );
    }

    const admissionForm = await AdmissionForm.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!admissionForm) {
      throw new CustomError("Admission form not found", 404);
    }

    logger.info("Admission form status updated", {
      id: admissionForm._id,
      newStatus: status
    });

    ApiResponse.success(
      res,
      admissionForm,
      "Admission form status updated successfully",
      200
    );
  }
);

// @desc    Delete admission form
// @route   DELETE /api/admission-form/:id
// @access  Private (should be protected with admin auth)
export const deleteAdmissionForm = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const admissionForm = await AdmissionForm.findByIdAndDelete(id);

    if (!admissionForm) {
      throw new CustomError("Admission form not found", 404);
    }

    logger.info("Admission form deleted", { id });

    ApiResponse.success(
      res,
      null,
      "Admission form deleted successfully",
      200
    );
  }
);

