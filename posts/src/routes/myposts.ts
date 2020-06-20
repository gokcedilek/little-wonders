import express, { Request, Response } from 'express';
import { Post } from '../models/post';
import { requireAuth } from '@gdsocialevents/common';

const router = express.Router();

router.get(
  '/api/posts/my/all',
  requireAuth,
  async (req: Request, res: Response) => {
    console.log('REACHED!');
    const myposts = await Post.find({ userId: req.currentUser!.id });
    res.send(myposts).status(200);
  }
);

export { router as mypostsPostRouter };
