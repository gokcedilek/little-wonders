import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'; //check the body of the request - apply it as a middleware!
import { RequestValidationError } from '../errors/RequestValidationError';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};
