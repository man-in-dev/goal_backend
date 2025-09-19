import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res: Response, message: string = 'Error', statusCode: number = 500, error?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }

  static created(res: Response, data: any, message: string = 'Created successfully') {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}

// Export individual functions for easier imports
export const successResponse = (res: Response, data: any, message: string = 'Success', statusCode: number = 200) => {
  return ApiResponse.success(res, data, message, statusCode);
};

export const errorResponse = (res: Response, message: string = 'Error', statusCode: number = 500, error?: any) => {
  return ApiResponse.error(res, message, statusCode, error);
}; 