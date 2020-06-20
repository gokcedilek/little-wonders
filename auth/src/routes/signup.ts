import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator'; //check the body of the request - apply it as a middleware!
import jwt from 'jsonwebtoken';
import { validateRequest } from '@gdsocialevents/common';
import { signupUser } from '../middlewares/signup-user';
import { User } from '../models/user';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const userValidationRules = () => {
  return [
    body('email').isEmail().withMessage('email must be valid!'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('invalid password!'),
  ];
};

router.post(
  '/api/users/signup',
  userValidationRules(),
  validateRequest,
  signupUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = User.build({ email: email, password: password });

      await user.save();

      //generate the jwt
      const userJWT = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY!
      );

      //store the jwt on the session object --> cookie-session will serialize this (base64 encoded) and send it off to the user's browser!
      // @ts-ignore
      req.session = {
        jwt: userJWT,
      };

      new UserCreatedPublisher(natsWrapper.theClient).publish({
        id: user.id,
        version: user.version,
        email: user.email,
      });
      res.status(201).send(user);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);

export { router as signupRouter };
