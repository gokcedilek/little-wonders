import express, { Request, Response } from 'express';
import { Post } from '../models/post';
import { requireAuth } from '@gdsocialevents/common';

const router = express.Router();

router.get(
  '/api/posts/of/user',
  requireAuth,
  async (req: Request, res: Response) => {
    const posts = await Post.find({ userId: req.currentUser!.id });
    res.send(posts).status(200);
  }
);

export { router as userPostsRouter };
