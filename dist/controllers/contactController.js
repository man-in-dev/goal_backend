"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.getContactStats = exports.updateContactStatus = exports.getContactById = exports.getAllContacts = exports.submitContact = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const contactService_1 = require("../services/contactService");
const errorHandler_1 = require("../middleware/errorHandler");
// @desc    Submit contact form
// @route   POST /api/contact/submit
// @access  Public
exports.submitContact = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, state, district, subject, message, location, department, source, } = req.body;
    logger_1.logger.info("Contact form submission attempt", { email, subject });
    // Validate required fields
    if (!name ||
        !email ||
        !phone ||
        !state ||
        !district ||
        !subject ||
        !message) {
        throw new errorHandler_1.CustomError("Please provide all required fields", 400);
    }
    const contact = yield contactService_1.ContactService.createContact({
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
    });
    response_1.ApiResponse.success(res, contact, "Contact form submitted successfully. We will get back to you soon!", 201);
}));
// @desc    Get all contact forms (Admin only)
// @route   GET /api/contact/forms
// @access  Private
exports.getAllContacts = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const state = req.query.state;
    const result = yield contactService_1.ContactService.getAllContacts(page, limit, status, state);
    response_1.ApiResponse.success(res, result, "Contact forms retrieved successfully");
}));
// @desc    Get contact form by ID (Admin only)
// @route   GET /api/contact/forms/:id
// @access  Private
exports.getContactById = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const contact = yield contactService_1.ContactService.getContactById(id);
    response_1.ApiResponse.success(res, contact, "Contact form retrieved successfully");
}));
// @desc    Update contact form status (Admin only)
// @route   PATCH /api/contact/forms/:id/status
// @access  Private
exports.updateContactStatus = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!status ||
        !["pending", "contacted", "resolved", "closed"].includes(status)) {
        throw new errorHandler_1.CustomError("Please provide a valid status", 400);
    }
    const contact = yield contactService_1.ContactService.updateContactStatus(id, status);
    response_1.ApiResponse.success(res, contact, "Contact form status updated successfully");
}));
// @desc    Get contact form statistics (Admin only)
// @route   GET /api/contact/stats
// @access  Private
exports.getContactStats = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield contactService_1.ContactService.getContactStats();
    response_1.ApiResponse.success(res, stats, "Statistics retrieved successfully");
}));
// @desc    Delete contact form (Admin only)
// @route   DELETE /api/contact/forms/:id
// @access  Private
exports.deleteContact = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield contactService_1.ContactService.deleteContact(id);
    response_1.ApiResponse.success(res, null, "Contact form deleted successfully");
}));
//# sourceMappingURL=contactController.js.map