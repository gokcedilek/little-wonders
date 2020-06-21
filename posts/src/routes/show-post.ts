import express, { Request, Response, NextFunction } from 'express';
import { Post } from '../models/post';
import { NotFoundError } from '@gdsocialevents/common';

const router = express.Router();

router.get(
  '/api/posts/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        throw new NotFoundError('This post does not exist!');
      }
      res.send(post).status(200);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as showPostRouter };
