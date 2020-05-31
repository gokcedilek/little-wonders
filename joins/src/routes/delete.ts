import express, { Request, Response, NextFunction } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from '@gdsocialevents/common';
import { Join, JoinStatus } from '../models/join';
import { Post } from '../models/post';
import { User } from '../models/user';
import { JoinCancelledPublisher } from '../events/publishers/join-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/joins/:postId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const userId = req.currentUser!.id;

      const post = await Post.findById(postId);
      if (!post) {
        throw new NotFoundError();
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError();
      }

      const join = await Join.findOne({ user: user, post: post });
      if (!join) {
        throw new NotFoundError();
      }

      join.status = JoinStatus.Cancelled;
      await join.save();

      //publish an event saying a join was cancelled!
      new JoinCancelledPublisher(natsWrapper.theClient).publish({
        id: join.id,
        post: {
          id: post.id,
        },
        version: join.version,
      });
      res.status(204).send(join);
      console.log(join);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as deleteJoinRouter };
