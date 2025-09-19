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
exports.authenticateToken = exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = __importDefault(require("../config/envConfig"));
const errorHandler_1 = require("./errorHandler");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        next(new errorHandler_1.CustomError('Not authorized to access this route', 401));
        return;
    }
    try {
        console.log('Auth middleware: Verifying token with secret:', envConfig_1.default.JWT_SECRET);
        const decoded = jsonwebtoken_1.default.verify(token, envConfig_1.default.JWT_SECRET);
        console.log('Auth middleware: Token decoded successfully:', decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log('Auth middleware: Token verification failed:', error);
        next(new errorHandler_1.CustomError('Not authorized to access this route', 401));
    }
});
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            next(new errorHandler_1.CustomError('User not authenticated', 401));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new errorHandler_1.CustomError(`User role ${req.user.role} is not authorized to access this route`, 403));
            return;
        }
        next();
    };
};
exports.authorize = authorize;
// Alias for protect function to match the import name used in routes
exports.authenticateToken = exports.protect;
//# sourceMappingURL=auth.js.map