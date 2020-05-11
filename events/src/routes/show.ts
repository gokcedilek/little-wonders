import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/event';
import { NotFoundError } from '@gdsocialevents/common';

const router = express.Router();

router.get(
  '/api/events/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        throw new NotFoundError();
      }
      res.send(event).status(200);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as showEventRouter };
