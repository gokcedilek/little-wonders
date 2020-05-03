import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/NotAuthorizedError';

//reject the request if the user is not logged in (logged in: req.currentUser is defined!)
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //assumption: we will use this middleware AFTER the currentUser middleware
  if (!req.currentUser) {
    throw new NotAuthorizedError('not authorized');
  }
  next();
};
