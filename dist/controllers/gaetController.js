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
exports.deleteGAETForm = exports.getGAETStats = exports.updateGAETFormStatus = exports.getGAETFormByRegistrationNumber = exports.getGAETFormById = exports.getAllGAETForms = exports.submitGAET = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const gaetService_1 = require("../services/gaetService");
const errorHandler_1 = require("../middleware/errorHandler");
// @desc    Submit GAET form
// @route   POST /api/gaet/submit
// @access  Public
exports.submitGAET = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, fatherName, motherName, dateOfBirth, gender, address, city, state, pincode, schoolName, currentClass, examCenter, examDate, paymentMethod, agreeToTerms, source } = req.body;
    logger_1.logger.info("GAET form submission attempt", { email, name });
    // Validate required fields
    if (!name || !email || !phone || !fatherName || !motherName || !dateOfBirth ||
        !gender || !address || !city || !state || !pincode || !schoolName ||
        !currentClass || !examCenter || !examDate || !paymentMethod || !agreeToTerms) {
        throw new errorHandler_1.CustomError("Please provide all required fields", 400);
    }
    // Validate terms agreement
    if (!agreeToTerms) {
        throw new errorHandler_1.CustomError("You must agree to the terms and conditions", 400);
    }
    const gaetForm = yield gaetService_1.GAETService.createGAETForm({
        name,
        email,
        phone,
        fatherName,
        motherName,
        dateOfBirth,
        gender,
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
    response_1.ApiResponse.success(res, Object.assign(Object.assign({}, gaetForm.toObject()), { registrationNumber: gaetForm.registrationNumber }), "GAET form submitted successfully! Your registration number is " + gaetForm.registrationNumber, 201);
}));
// @desc    Get all GAET forms (Admin only)
// @route   GET /api/gaet/forms
// @access  Private
exports.getAllGAETForms = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const examCenter = req.query.examCenter;
    const result = yield gaetService_1.GAETService.getAllGAETForms(page, limit, status, examCenter);
    response_1.ApiResponse.success(res, result, "GAET forms retrieved successfully");
}));
// @desc    Get GAET form by ID (Admin only)
// @route   GET /api/gaet/forms/:id
// @access  Private
exports.getGAETFormById = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const form = yield gaetService_1.GAETService.getGAETFormById(id);
    response_1.ApiResponse.success(res, form, "GAET form retrieved successfully");
}));
// @desc    Get GAET form by registration number (Public)
// @route   GET /api/gaet/registration/:registrationNumber
// @access  Public
exports.getGAETFormByRegistrationNumber = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationNumber } = req.params;
    const form = yield gaetService_1.GAETService.getGAETFormByRegistrationNumber(registrationNumber);
    response_1.ApiResponse.success(res, form, "GAET form retrieved successfully");
}));
// @desc    Update GAET form status (Admin only)
// @route   PATCH /api/gaet/forms/:id/status
// @access  Private
exports.updateGAETFormStatus = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['pending', 'verified', 'approved', 'rejected'].includes(status)) {
        throw new errorHandler_1.CustomError("Please provide a valid status", 400);
    }
    const form = yield gaetService_1.GAETService.updateGAETFormStatus(id, status);
    response_1.ApiResponse.success(res, form, "GAET form status updated successfully");
}));
// @desc    Get GAET form statistics (Admin only)
// @route   GET /api/gaet/stats
// @access  Private
exports.getGAETStats = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield gaetService_1.GAETService.getGAETStats();
    response_1.ApiResponse.success(res, stats, "Statistics retrieved successfully");
}));
// @desc    Delete GAET form (Admin only)
// @route   DELETE /api/gaet/forms/:id
// @access  Private
exports.deleteGAETForm = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield gaetService_1.GAETService.deleteGAETForm(id);
    response_1.ApiResponse.success(res, null, "GAET form deleted successfully");
}));
//# sourceMappingURL=gaetController.js.map