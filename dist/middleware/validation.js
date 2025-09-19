"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = exports.sanitizeInput = exports.validateRequest = void 0;
const errorHandler_1 = require("./errorHandler");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                next(new errorHandler_1.CustomError(errorMessage, 400));
                return;
            }
            next();
        }
        catch (error) {
            next(new errorHandler_1.CustomError('Validation error', 400));
        }
    };
};
exports.validateRequest = validateRequest;
const sanitizeInput = (req, res, next) => {
    // Basic input sanitization
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }
    next();
};
exports.sanitizeInput = sanitizeInput;
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
        next(new errorHandler_1.CustomError('Invalid ID format', 400));
        return;
    }
    next();
};
exports.validateObjectId = validateObjectId;
//# sourceMappingURL=validation.js.map