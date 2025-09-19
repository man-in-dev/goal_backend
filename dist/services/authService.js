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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
class AuthService {
    static registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, role } = userData;
            // Check if user already exists
            const existingUser = yield User_1.default.findOne({ email });
            if (existingUser) {
                throw new errorHandler_1.CustomError('User already exists', 400);
            }
            // Create user
            const user = yield User_1.default.create({
                name,
                email,
                password,
                role: role || 'user'
            });
            logger_1.logger.info('User registered successfully', { userId: user._id, email });
            return user;
        });
    }
    static loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for demo admin credentials first
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@goalinstitute.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
            if (email === adminEmail && password === adminPassword) {
                // Check if admin user exists, if not create one
                let adminUser = yield User_1.default.findOne({ email: adminEmail });
                if (!adminUser) {
                    adminUser = yield User_1.default.create({
                        name: 'Admin User',
                        email: adminEmail,
                        password: adminPassword,
                        role: 'admin',
                        isActive: true
                    });
                    logger_1.logger.info('Admin user created', { userId: adminUser._id, email: adminEmail });
                }
                logger_1.logger.info('Admin logged in successfully', { userId: adminUser._id, email: adminEmail });
                return adminUser;
            }
            // Check for regular user
            const user = yield User_1.default.findOne({ email }).select('+password');
            if (!user) {
                throw new errorHandler_1.CustomError('Invalid credentials', 401);
            }
            // Check if password matches
            const isMatch = yield user.matchPassword(password);
            if (!isMatch) {
                throw new errorHandler_1.CustomError('Invalid credentials', 401);
            }
            // Check if user is active
            if (!user.isActive) {
                throw new errorHandler_1.CustomError('Account is deactivated', 401);
            }
            logger_1.logger.info('User logged in successfully', { userId: user._id, email });
            return user;
        });
    }
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.findById(userId);
        });
    }
    static updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true
            });
        });
    }
    static deactivateUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.findByIdAndUpdate(userId, { isActive: false }, { new: true });
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map