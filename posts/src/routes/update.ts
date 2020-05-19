import express, { Request, Response, NextFunction } from 'express';
import { Post } from '../models/post';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@gdsocialevents/common';
import { PostUpdatedPublisher } from '../events/publishers/post-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const userValidationRules = () => {
  return [
    body('title').not().isEmpty().withMessage('title is required!'),
    body('description').not().isEmpty().withMessage('description is required!'),
  ];
};

router.put(
  '/api/posts/:id',
  requireAuth,
  userValidationRules(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        throw new NotFoundError();
      }
      if (post.userId != req.currentUser!.id) {
        throw new NotAuthorizedError('user is not authorized!');
      }
      //to update a document: pass an object to 'set'
      post.set({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
      });
      await post.save();
      new PostUpdatedPublisher(natsWrapper.theClient).publish({
        id: post.id,
        title: post.title,
        price: post.price,
        userId: post.userId,
      });
      res.send(post);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as updatePostRouter };
