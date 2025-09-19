import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type AuthAsyncFunction = (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction | AuthAsyncFunction) => {
  return (req: Request | AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as any, res, next)).catch(next);
  };
}; 