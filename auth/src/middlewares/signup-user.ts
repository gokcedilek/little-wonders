import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@gdsocialevents/common';
import { User } from '../models/user';

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('user already exists!');
    }
    next();
  } catch (err) {
    next(err); //async error handling!
  }
};
