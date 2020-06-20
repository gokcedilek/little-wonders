import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { requireAuth, NotFoundError } from '@gdsocialevents/common';
import { Join } from '../models/join';

const router = express.Router();

//get all joins (& events) the current user has signed up for
router.get(
  '/api/joins',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.currentUser!.id);
      if (!user) {
        throw new NotFoundError('This user does not exist!');
      }
      const joins = await Join.find({ user: user }).populate('post');
      res.status(200).send(joins);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as showPostsRouter };
