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
exports.deleteApplication = exports.getRecentApplications = exports.getApplicationStats = exports.updateApplicationStatus = exports.getApplicationById = exports.getAllApplications = exports.submitApplication = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const careerApplicationService_1 = require("../services/careerApplicationService");
const errorHandler_1 = require("../middleware/errorHandler");
// @desc    Submit career application
// @route   POST /api/career-applications/submit
// @access  Public
exports.submitApplication = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, phone, position, experience, education, currentCompany, expectedSalary, skills, coverLetter, source, } = req.body;
    // Handle file upload
    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : undefined;
    const resumeFileName = req.file ? req.file.originalname : undefined;
    logger_1.logger.info("Career application submission attempt", { email, position });
    // Validate required fields
    if (!fullName ||
        !email ||
        !phone ||
        !position ||
        !experience ||
        !education ||
        !skills ||
        !coverLetter) {
        throw new errorHandler_1.CustomError("Please provide all required fields", 400);
    }
    const application = yield careerApplicationService_1.CareerApplicationService.createApplication({
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
    response_1.ApiResponse.success(res, { applicationId: application._id }, "Career application submitted successfully. We will review your application and get back to you soon!", 201);
}));
// @desc    Get all career applications (Admin only)
// @route   GET /api/career-applications
// @access  Private
exports.getAllApplications = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const position = req.query.position;
    const search = req.query.search;
    const result = yield careerApplicationService_1.CareerApplicationService.getAllApplications(page, limit, status, position, search);
    response_1.ApiResponse.success(res, result, "Career applications retrieved successfully");
}));
// @desc    Get career application by ID (Admin only)
// @route   GET /api/career-applications/:id
// @access  Private
exports.getApplicationById = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const application = yield careerApplicationService_1.CareerApplicationService.getApplicationById(id);
    response_1.ApiResponse.success(res, application, "Career application retrieved successfully");
}));
// @desc    Update career application status (Admin only)
// @route   PATCH /api/career-applications/:id/status
// @access  Private
exports.updateApplicationStatus = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, notes } = req.body;
    if (!status ||
        !["pending", "under-review", "shortlisted", "interview-scheduled", "rejected", "hired"].includes(status)) {
        throw new errorHandler_1.CustomError("Please provide a valid status", 400);
    }
    const application = yield careerApplicationService_1.CareerApplicationService.updateApplicationStatus(id, status, notes);
    response_1.ApiResponse.success(res, application, "Career application status updated successfully");
}));
// @desc    Get career application statistics (Admin only)
// @route   GET /api/career-applications/stats
// @access  Private
exports.getApplicationStats = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield careerApplicationService_1.CareerApplicationService.getApplicationStats();
    response_1.ApiResponse.success(res, stats, "Statistics retrieved successfully");
}));
// @desc    Get recent career applications (Admin only)
// @route   GET /api/career-applications/recent
// @access  Private
exports.getRecentApplications = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 5;
    const applications = yield careerApplicationService_1.CareerApplicationService.getRecentApplications(limit);
    response_1.ApiResponse.success(res, applications, "Recent applications retrieved successfully");
}));
// @desc    Delete career application (Admin only)
// @route   DELETE /api/career-applications/:id
// @access  Private
exports.deleteApplication = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield careerApplicationService_1.CareerApplicationService.deleteApplication(id);
    response_1.ApiResponse.success(res, null, "Career application deleted successfully");
}));
//# sourceMappingURL=careerApplicationController.js.map