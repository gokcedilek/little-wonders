import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, NotFoundError } from '@gdsocialevents/common';
import { Join } from '../models/join';
import { JoinStatus } from '@gdsocialevents/common/';
import { natsWrapper } from '../nats-wrapper';
import { JoinConfirmedPublisher } from '../events/publishers/join-confirmed-publisher';

const router = express.Router();

router.post(
  '/api/joins/confirmed/:joinId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('route is working!?');
      const join = await Join.findById(req.params.joinId);
      if (!join) {
        throw new NotFoundError('This join does not exist!');
      }

      join.set({ status: JoinStatus.Confirmed });

      await join.save();

      //console.log(join);

      //publish join-confirmed
      new JoinConfirmedPublisher(natsWrapper.theClient).publish({
        id: join.id,
        version: join.version,
        status: join.status,
        user: {
          id: join.user.id,
          email: join.user.email,
        },
        post: {
          id: join.post.id,
        },
      });

      console.log(join);

      res.status(201).send(join);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as confirmJoinRouter };
