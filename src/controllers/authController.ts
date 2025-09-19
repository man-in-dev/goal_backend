import { Request, Response, NextFunction } from "express";

import { IUser } from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/response";
import { logger } from "../utils/logger";
import { AuthService } from "../services/authService";
import { CustomError } from "../middleware/errorHandler";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password, role } = req.body;

    logger.info("User registration attempt", { email });

    const user = await AuthService.registerUser({
      name,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 201, res);
  }
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    logger.info("User login attempt", { email });

    // Validate email & password
    if (!email || !password) {
      throw new CustomError("Please provide an email and password", 400);
    }

    console.log("Email and password", email, password);

    const user = await AuthService.loginUser(email, password);

    sendTokenResponse(user, 200, res);
  }
);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = await AuthService.getUserById(req.user.id);
    ApiResponse.success(res, user, "User retrieved successfully");
  }
);

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    ApiResponse.success(res, null, "Logged out successfully");
  }
);

// Get token from model, create cookie and send response
const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {
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
