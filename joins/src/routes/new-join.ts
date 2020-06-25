import express, { Request, Response, NextFunction } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from '@gdsocialevents/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Post } from '../models/post';
import { User } from '../models/user';
import { Join } from '../models/join';
import { JoinStatus } from '@gdsocialevents/common/';
import { JoinCreatedPublisher } from '../events/publishers/join-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

//const EXP_WINDOW_SECONDS = 1 * 60; //15 minutes -- TODO: you can save this as a k8s env variable!!!

//custom validation: input id --> bool representing valid id or not (if the user is providing a valid mongo id)
const joinValidationRules = () => {
  return [
    body('postId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Post id is required!'),
  ];
};

//we are not saving anything to the ticket model, how do we expect it to be populated??

router.post(
  '/api/joins',
  requireAuth,
  joinValidationRules(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //find the post the user is attempting to signup for
      const { postId } = req.body;
      const post = await Post.findById(postId);
      if (!post) {
        throw new NotFoundError('This post does not exist!');
      }

      const user = await User.findById(req.currentUser!.id);
      if (!user) {
        throw new NotFoundError('This user does not exist!');
      }

      //check if there is space available to sign up for
      const isFull = await post.isFull();
      if (isFull) {
        throw new BadRequestError('This event is already full!');
      }

      //calculate exp date for this signup attempt
      // const expiration = new Date();
      // expiration.setSeconds(expiration.getSeconds() + EXP_WINDOW_SECONDS);

      const join = Join.build({
        user: user,
        status: JoinStatus.Created,
        //expAt: expiration,
        post: post,
      });
      await join.save();

      //publish an event for the successful join
      new JoinCreatedPublisher(natsWrapper.theClient).publish({
        id: join.id,
        version: join.version,
        status: join.status,
        user: {
          id: user.id,
          email: user.email,
        },
        post: {
          id: post.id,
        },
      });
      res.status(201).send(join);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as newJoinRouter };
