import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import EnvVariables from '../config/envConfig';
import { CustomError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    next(new CustomError('Not authorized to access this route', 401));
    return;
  }

  try {
    console.log('Auth middleware: Verifying token with secret:', EnvVariables.JWT_SECRET);
    const decoded = jwt.verify(token, EnvVariables.JWT_SECRET);
    console.log('Auth middleware: Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Auth middleware: Token verification failed:', error);
    next(new CustomError('Not authorized to access this route', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new CustomError('User not authenticated', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new CustomError(`User role ${req.user.role} is not authorized to access this route`, 403));
      return;
    }

    next();
  };
};

// Alias for protect function to match the import name used in routes
export const authenticateToken = protect; 