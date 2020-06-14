import express, { Request, Response, NextFunction } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@gdsocialevents/common';
import { Join } from '../models/join';
import { User } from '../models/user';

const router = express.Router();

router.get(
  '/api/joins/:joinId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.currentUser!.id);
      if (!user) {
        console.log('user not found');
        throw new NotFoundError();
      }
      const join = await Join.findById(req.params.joinId).populate('user');
      if (!join) {
        console.log('join not found');
        throw new NotFoundError();
      }
      if (user.id != join.user.id) {
        throw new NotAuthorizedError('this join does not belong to this user!');
      }
      //otherwise, join belongs to the user, send it back
      console.log('FOUND THE JOIN');
      res.status(200).send(join);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as showJoinRouter };
