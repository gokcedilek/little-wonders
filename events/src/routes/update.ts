import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/event';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@gdsocialevents/common';

const router = express.Router();

const userValidationRules = () => {
  return [
    body('title').not().isEmpty().withMessage('title is required!'),
    body('description').not().isEmpty().withMessage('description is required!'),
  ];
};

router.put(
  '/api/events/:id',
  requireAuth,
  userValidationRules(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        throw new NotFoundError();
      }
      if (event.userId != req.currentUser!.id) {
        throw new NotAuthorizedError('user is not authorized!');
      }
      //to update a document: pass an object to 'set'
      event.set({
        title: req.body.title,
        description: req.body.description,
      });
      await event.save();
      res.send(event);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as updateEventRouter };
