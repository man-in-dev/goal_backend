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
exports.deleteGVETForm = exports.getGVETStats = exports.updateGVETFormStatus = exports.getGVETFormByRegistrationNumber = exports.getGVETFormById = exports.getAllGVETForms = exports.submitGVET = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const gvetService_1 = require("../services/gvetService");
const errorHandler_1 = require("../middleware/errorHandler");
// @desc    Submit GVET form
// @route   POST /api/gvet/submit
// @access  Public
exports.submitGVET = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, fatherName, motherName, dateOfBirth, gender, category, address, city, state, pincode, schoolName, currentClass, examCenter, examDate, paymentMethod, agreeToTerms, source } = req.body;
    logger_1.logger.info("GVET form submission attempt", { email, name });
    // Validate required fields
    if (!name || !email || !phone || !fatherName || !motherName || !dateOfBirth ||
        !gender || !category || !address || !city || !state || !pincode || !schoolName ||
        !currentClass || !examCenter || !examDate || !paymentMethod || !agreeToTerms) {
        throw new errorHandler_1.CustomError("Please provide all required fields", 400);
    }
    // Validate terms agreement
    if (!agreeToTerms) {
        throw new errorHandler_1.CustomError("You must agree to the terms and conditions", 400);
    }
    const gvetForm = yield gvetService_1.GVETService.createGVETForm({
        name,
        email,
        phone,
        fatherName,
        motherName,
        dateOfBirth,
        gender,
        category,
        address,
        city,
        state,
        pincode,
        schoolName,
        currentClass,
        examCenter,
        examDate,
        paymentMethod,
        agreeToTerms,
        source
    });
    response_1.ApiResponse.success(res, Object.assign(Object.assign({}, gvetForm.toObject()), { registrationNumber: gvetForm.registrationNumber }), "GVET form submitted successfully! Your registration number is " + gvetForm.registrationNumber, 201);
}));
// @desc    Get all GVET forms (Admin only)
// @route   GET /api/gvet/forms
// @access  Private
exports.getAllGVETForms = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const examCenter = req.query.examCenter;
    const result = yield gvetService_1.GVETService.getAllGVETForms(page, limit, status, examCenter);
    response_1.ApiResponse.success(res, result, "GVET forms retrieved successfully");
}));
// @desc    Get GVET form by ID (Admin only)
// @route   GET /api/gvet/forms/:id
// @access  Private
exports.getGVETFormById = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const form = yield gvetService_1.GVETService.getGVETFormById(id);
    response_1.ApiResponse.success(res, form, "GVET form retrieved successfully");
}));
// @desc    Get GVET form by registration number (Public)
// @route   GET /api/gvet/registration/:registrationNumber
// @access  Public
exports.getGVETFormByRegistrationNumber = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationNumber } = req.params;
    const form = yield gvetService_1.GVETService.getGVETFormByRegistrationNumber(registrationNumber);
    response_1.ApiResponse.success(res, form, "GVET form retrieved successfully");
}));
// @desc    Update GVET form status (Admin only)
// @route   PATCH /api/gvet/forms/:id/status
// @access  Private
exports.updateGVETFormStatus = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['pending', 'verified', 'approved', 'rejected'].includes(status)) {
        throw new errorHandler_1.CustomError("Please provide a valid status", 400);
    }
    const form = yield gvetService_1.GVETService.updateGVETFormStatus(id, status);
    response_1.ApiResponse.success(res, form, "GVET form status updated successfully");
}));
// @desc    Get GVET form statistics (Admin only)
// @route   GET /api/gvet/stats
// @access  Private
exports.getGVETStats = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield gvetService_1.GVETService.getGVETStats();
    response_1.ApiResponse.success(res, stats, "Statistics retrieved successfully");
}));
// @desc    Delete GVET form (Admin only)
// @route   DELETE /api/gvet/forms/:id
// @access  Private
exports.deleteGVETForm = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield gvetService_1.GVETService.deleteGVETForm(id);
    response_1.ApiResponse.success(res, null, "GVET form deleted successfully");
}));
//# sourceMappingURL=gvetController.js.map