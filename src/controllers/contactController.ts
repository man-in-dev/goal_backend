import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { logger } from "../utils/logger";
import { ContactService } from "../services/contactService";
import { CustomError } from "../middleware/errorHandler";

// @desc    Submit contact form
// @route   POST /api/contact/submit
// @access  Public
export const submitContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      name,
      email,
      phone,
      state,
      district,
      subject,
      message,
      location,
      department,
      source,
      studying,
    } = req.body;

    logger.info("Contact form submission attempt", { email: email || "N/A", subject: subject || "N/A", name });

    // Validate required fields
    if (
      !name ||
      !phone ||
      !state ||
      !district ||
      !studying
    ) {
      throw new CustomError("Please provide all required fields", 400);
    }

    const contact = await ContactService.createContact({
      name,
      email,
      phone,
      state,
      district,
      studying,
      course: req.body.course,
      subject,
      message,
      location,
      department,
      source,
    });

    ApiResponse.success(
      res,
      contact,
      "Contact form submitted successfully. We will get back to you soon!",
      201
    );
  }
);

// @desc    Get all contact forms (Admin only)
// @route   GET /api/contact/forms
// @access  Private
export const getAllContacts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const state = req.query.state as string;

    const result = await ContactService.getAllContacts(
      page,
      limit,
      status,
      state
    );

    ApiResponse.success(res, result, "Contact forms retrieved successfully");
  }
);

// @desc    Get contact form by ID (Admin only)
// @route   GET /api/contact/forms/:id
// @access  Private
export const getContactById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const contact = await ContactService.getContactById(id);

    ApiResponse.success(res, contact, "Contact form retrieved successfully");
  }
);

// @desc    Update contact form status (Admin only)
// @route   PATCH /api/contact/forms/:id/status
// @access  Private
export const updateContactStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !status ||
      !["pending", "contacted", "resolved", "closed"].includes(status)
    ) {
      throw new CustomError("Please provide a valid status", 400);
    }

    const contact = await ContactService.updateContactStatus(id, status);

    ApiResponse.success(
      res,
      contact,
      "Contact form status updated successfully"
    );
  }
);

// @desc    Get contact form statistics (Admin only)
// @route   GET /api/contact/stats
// @access  Private
export const getContactStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const stats = await ContactService.getContactStats();

    ApiResponse.success(res, stats, "Statistics retrieved successfully");
  }
);

// @desc    Delete contact form (Admin only)
// @route   DELETE /api/contact/forms/:id
// @access  Private
export const deleteContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    await ContactService.deleteContact(id);

    ApiResponse.success(res, null, "Contact form deleted successfully");
  }
);
