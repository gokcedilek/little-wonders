import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@gdsocialevents/common';
import { User } from '../models/user';

export const signinUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    console.log('checking existing user');
    if (!existingUser) {
      console.log('user does not exist');
      throw new BadRequestError('invalid credentials!');
    }
    console.log('user exists!');
    next();
  } catch (err) {
    next(err); //async error handling!
  }
};
