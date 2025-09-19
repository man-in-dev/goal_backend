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
exports.logout = exports.getMe = exports.login = exports.register = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const authService_1 = require("../services/authService");
const errorHandler_1 = require("../middleware/errorHandler");
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    logger_1.logger.info("User registration attempt", { email });
    const user = yield authService_1.AuthService.registerUser({
        name,
        email,
        password,
        role,
    });
    sendTokenResponse(user, 201, res);
}));
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    logger_1.logger.info("User login attempt", { email });
    // Validate email & password
    if (!email || !password) {
        throw new errorHandler_1.CustomError("Please provide an email and password", 400);
    }
    console.log("Email and password", email, password);
    const user = yield authService_1.AuthService.loginUser(email, password);
    sendTokenResponse(user, 200, res);
}));
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield authService_1.AuthService.getUserById(req.user.id);
    response_1.ApiResponse.success(res, user, "User retrieved successfully");
}));
// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    response_1.ApiResponse.success(res, null, "Logged out successfully");
}));
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};
//# sourceMappingURL=authController.js.map