import express, { Request, Response, NextFunction } from 'express';
import { Join } from '../models/join';
import { Post } from '../models/post';
import { requireAuth, NotFoundError } from '@gdsocialevents/common';

const router = express.Router();

//todo: ONLY THE OWNER OF THE EVENT CAN ACCESS? need to use post.ownerId OR can only access if you've signed up for this event?
router.get(
  '/api/joins/users/:postId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        throw new NotFoundError();
      }
      /*
      if(post.ownerId !== req.currentUser!.id) {
        throw new notAuthorizedError()
      }
      */
      const users = await Join.find({ post: post }).populate('user');
      console.log('this is working!');
      res.status(200).send(users);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as showUsersRouter };
