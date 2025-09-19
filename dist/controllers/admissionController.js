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
exports.deleteEnquiry = exports.getEnquiryStats = exports.updateEnquiryStatus = exports.getEnquiryById = exports.getAllEnquiries = exports.submitEnquiry = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const admissionService_1 = require("../services/admissionService");
const errorHandler_1 = require("../middleware/errorHandler");
// @desc    Submit admission enquiry
// @route   POST /api/admission/enquiry
// @access  Public
exports.submitEnquiry = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, course, studyLevel, address, message, source } = req.body;
    logger_1.logger.info("Admission enquiry submission attempt", { email, course });
    // Validate required fields
    if (!name || !email || !phone || !course || !studyLevel) {
        throw new errorHandler_1.CustomError("Please provide all required fields", 400);
    }
    const enquiry = yield admissionService_1.AdmissionService.createEnquiry({
        name,
        email,
        phone,
        course,
        studyLevel,
        address,
        message,
        source
    });
    response_1.ApiResponse.success(res, enquiry, "Admission enquiry submitted successfully. We will contact you soon!", 201);
}));
// @desc    Get all admission enquiries (Admin only)
// @route   GET /api/admission/enquiries
// @access  Private
exports.getAllEnquiries = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const course = req.query.course;
    const result = yield admissionService_1.AdmissionService.getAllEnquiries(page, limit, status, course);
    response_1.ApiResponse.success(res, result, "Enquiries retrieved successfully");
}));
// @desc    Get admission enquiry by ID (Admin only)
// @route   GET /api/admission/enquiries/:id
// @access  Private
exports.getEnquiryById = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const enquiry = yield admissionService_1.AdmissionService.getEnquiryById(id);
    response_1.ApiResponse.success(res, enquiry, "Enquiry retrieved successfully");
}));
// @desc    Update enquiry status (Admin only)
// @route   PATCH /api/admission/enquiries/:id/status
// @access  Private
exports.updateEnquiryStatus = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['pending', 'contacted', 'enrolled', 'rejected'].includes(status)) {
        throw new errorHandler_1.CustomError("Please provide a valid status", 400);
    }
    const enquiry = yield admissionService_1.AdmissionService.updateEnquiryStatus(id, status);
    response_1.ApiResponse.success(res, enquiry, "Enquiry status updated successfully");
}));
// @desc    Get admission enquiry statistics (Admin only)
// @route   GET /api/admission/stats
// @access  Private
exports.getEnquiryStats = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield admissionService_1.AdmissionService.getEnquiryStats();
    response_1.ApiResponse.success(res, stats, "Statistics retrieved successfully");
}));
// @desc    Delete admission enquiry (Admin only)
// @route   DELETE /api/admission/enquiries/:id
// @access  Private
exports.deleteEnquiry = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield admissionService_1.AdmissionService.deleteEnquiry(id);
    response_1.ApiResponse.success(res, null, "Enquiry deleted successfully");
}));
//# sourceMappingURL=admissionController.js.map