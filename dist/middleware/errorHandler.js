"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = exports.CustomError = void 0;
const envConfig_1 = __importDefault(require("../config/envConfig"));
class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    // Log error
    console.error(err);
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = "Resource not found";
        error = new CustomError(message, 404);
    }
    // Mongoose duplicate key
    if (err.name === "MongoError" && err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new CustomError(message, 400);
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = new CustomError(message, 400);
    }
    // JWT errors
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token";
        error = new CustomError(message, 401);
    }
    if (err.name === "TokenExpiredError") {
        const message = "Token expired";
        error = new CustomError(message, 401);
    }
    res.status(error.statusCode || 500).json(Object.assign({ success: false, error: error.message || "Server Error" }, (envConfig_1.default.NODE_ENV === "development" && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    const error = new CustomError(`Not found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
//# sourceMappingURL=errorHandler.js.map