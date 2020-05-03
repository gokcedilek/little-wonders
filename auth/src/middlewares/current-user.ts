import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//interface that describes the payload
interface UserPayload {
  id: string;
  email: string;
}

//modifying the existing Request interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

//declare a user as "logged in"
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //if the user is logged in, extract user info from the jwt and set req.currentUser
  if (!req.session || !req.session.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload; //define a type for payload
    req.currentUser = payload;
  } catch (err) {}
  next();
};
