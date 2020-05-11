//create a new event
import express, { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@gdsocialevents/common';
import { body } from 'express-validator';
import { validateRequest, NotFoundError } from '@gdsocialevents/common';
import moment from 'moment';
import { Client, Status } from '@googlemaps/google-maps-services-js';
import { Event } from '../models/event';

const router = express.Router();

const userValidationRules = () => {
  return [
    body('title').not().isEmpty().withMessage('title is required!'),
    body('description').not().isEmpty().withMessage('description is required!'),
  ];
};

const locationValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client = new Client({});

  try {
    let result = await client.geocode({
      params: {
        address: req.body.location,
        key: 'AIzaSyAfPjiiFC9t-ixMAHY9tqf2YJw19TZ0w0k',
      },
      timeout: 10000,
    });
    console.log(result.data);
    if (result.data.status === Status.OK) {
      console.log(result.data.results[0].geometry.location);
      return next();
    } else {
      console.log(result.data.status);
      throw new NotFoundError();
    }
  } catch (err) {
    return next(err);
  }
};

const timeValidation = (req: Request, res: Response, next: NextFunction) => {
  //time format: `${year}-${month}-${day} ${hour}:${min} ${a}`
  const time = req.body.time;
  console.log(`time: ${time}`);
  if (moment(time, 'YYYY-M-D LT', true).isValid()) {
    console.log('valid!');
    return next();
  } else {
    console.log('nope!');
    throw new NotFoundError();
  }
};

router.post(
  '/api/events',
  requireAuth,
  userValidationRules(),
  validateRequest,
  locationValidation,
  timeValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, location, time } = req.body;
      const event = Event.build({
        title,
        description,
        userId: req.currentUser!.id,
      });
      await event.save();
      console.log(`arrived here with location: ${location} and time: ${time}`);
      res.status(201).send(event);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as createEventRouter };
