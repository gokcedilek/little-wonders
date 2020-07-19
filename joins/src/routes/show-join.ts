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
        throw new NotFoundError('This user does not exist!');
      }
      const join = await Join.findById(req.params.joinId)
        .populate('user')
        .populate('post');
      if (!join) {
        throw new NotFoundError('This join does not exist!');
      }
      if (user.id != join.user.id) {
        throw new NotAuthorizedError('this join does not belong to this user!');
      }
      //otherwise, join belongs to the user, send it back
      res.status(200).send(join);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as showJoinRouter };
