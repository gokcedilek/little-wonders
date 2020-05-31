//create a new event
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

const eventValidationRules = () => {
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
  console.log('geocoding ', req.body.location);
  try {
    let result = await client.geocode({
      params: {
        address: req.body.location,
        key: 'AIzaSyAfPjiiFC9t-ixMAHY9tqf2YJw19TZ0w0k', //HAVE TO STORE THIS IN A K8S SECRET!!!!!!!!!!!!!!!!!
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
    console.log('err!');
    console.log(err);
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
  '/api/posts',
  requireAuth,
  eventValidationRules(),
  validateRequest,
  //locationValidation,
  //timeValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const { title, description, location, time, price, numPeople } = req.body;
      const { title, description, price, numPeople } = req.body;
      const post = Post.build({
        title,
        description,
        price,
        userId: req.currentUser!.id,
        numPeople,
      });
      await post.save();
      console.log(
        `arrived here with ${post.id}, ${post.title}, ${post.price}, ${post.userId}`
      );
      new PostCreatedPublisher(natsWrapper.theClient).publish({
        id: post.id,
        version: post.version,
        title: post.title,
        price: post.price,
        userId: post.userId,
        numPeople: numPeople,
      });
      res.status(201).send(post);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as createPostRouter };
