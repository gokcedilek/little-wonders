import express, { Request, Response, NextFunction } from 'express';
import { Post } from '../models/post';
import { requireAuth } from '@gdsocialevents/common';

const router = express.Router();

router.get(
  '/api/posts/of/user',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await Post.find({ userId: req.currentUser!.id });
      res.send(posts).status(200);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as userPostsRouter };
