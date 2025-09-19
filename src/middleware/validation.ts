import { Request, Response, NextFunction } from 'express';
import { CustomError } from './errorHandler';

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
        next(new CustomError(errorMessage, 400));
        return;
      }
      next();
    } catch (error) {
      next(new CustomError('Validation error', 400));
    }
  };
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
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

export const validateObjectId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  
  if (!objectIdRegex.test(id)) {
    next(new CustomError('Invalid ID format', 400));
    return;
  }
  
  next();
}; 