import express, { Request, Response, NextFunction } from 'express';
import { Post } from '../models/post';

const router = express.Router();

router.get(
  '/api/posts',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const posts = await Post.find({
      //   $where: 'this.joinIds.length < this.numPeople',
      // }); //only retrieve posts that are not full
      const posts = await Post.find({});
      res.send(posts).status(200);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as indexPostsRouter };
