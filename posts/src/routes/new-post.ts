import express, { Request, Response, NextFunction, response } from 'express';
import { requireAuth } from '@gdsocialevents/common';
import { body } from 'express-validator';
import { validateRequest, NotFoundError } from '@gdsocialevents/common';
import moment from 'moment';
import { Client, Status } from '@googlemaps/google-maps-services-js';
import { Post } from '../models/post';
import { PostCreatedPublisher } from '../events/publishers/post-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const postValidationRules = () => {
  return [
    body('title').not().isEmpty().withMessage('title is required!'),
    body('description').not().isEmpty().withMessage('description is required!'),
    body('location').not().isEmpty().withMessage('location is required!'),
    body('numPeople')
      .not()
      .isEmpty()
      .withMessage('number of people is required!'),
    body('time').not().isEmpty().withMessage('time is required!'),
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
        key: process.env.GMAPS_KEY!, //HAVE TO STORE THIS IN A K8S SECRET!!!!!!!!!!!!!!!!!
      },
      timeout: 10000,
    });
    if (result.data.status === Status.OK) {
      return next();
    } else {
      //console.log(result.data.status);
      throw new NotFoundError('Event location could not be validated!');
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
    throw new NotFoundError('Event time could not be validated!');
  }
};

router.post(
  '/api/posts',
  requireAuth,
  postValidationRules(),
  validateRequest,
  locationValidation,
  timeValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, location, time, numPeople } = req.body;
      console.log('received time: ', time);
      const post = Post.build({
        title,
        description,
        userId: req.currentUser!.id,
        numPeople,
        location,
        time,
      });
      await post.save();

      console.log('saved post: ', post);

      new PostCreatedPublisher(natsWrapper.theClient).publish({
        id: post.id,
        version: post.version,
        title: post.title,
        description: post.description,
        userId: post.userId,
        numPeople: post.numPeople,
        location: post.location,
        time: post.time,
      });
      res.status(201).send(post);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as newPostRouter };
