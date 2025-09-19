"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    static error(res, message = 'Error', statusCode = 500, error) {
        return res.status(statusCode).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
    static created(res, data, message = 'Created successfully') {
        return this.success(res, data, message, 201);
    }
    static noContent(res) {
        return res.status(204).send();
    }
}
exports.ApiResponse = ApiResponse;
// Export individual functions for easier imports
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return ApiResponse.success(res, data, message, statusCode);
};
exports.successResponse = successResponse;
const errorResponse = (res, message = 'Error', statusCode = 500, error) => {
    return ApiResponse.error(res, message, statusCode, error);
};
exports.errorResponse = errorResponse;
//# sourceMappingURL=response.js.map