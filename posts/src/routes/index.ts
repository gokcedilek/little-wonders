import express, { Request, Response } from 'express';
import { Post } from '../models/post';

const router = express.Router();

router.get('/api/posts', async (req: Request, res: Response) => {
  const posts = await Post.find({}); //no filtering - all records
  res.send(posts).status(200);
});

export { router as indexPostRouter };
