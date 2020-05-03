import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator'; //check the body of the request - apply it as a middleware
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';
import { signinUser } from '../middlewares/signin-user';
import { User } from '../models/user';
import { Password } from '../services/password';
import { BadRequestError } from '../errors/BadRequestError';

const router = express.Router();

const userValidationRules = () => {
  return [
    body('email').isEmail().withMessage('email must be valid!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('password must be supplied!'),
  ];
};

router.post(
  '/api/users/signin',
  userValidationRules(),
  validateRequest,
  signinUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    console.log('here!');
    try {
      const match = await Password.compare(existingUser!.password, password);
      if (!match) {
        throw new BadRequestError('invalid credentials!');
      }
    } catch (err) {
      return next(err);
    }

    //generate the jwt
    const userJWT = jwt.sign(
      { user_id: existingUser!.id, user_email: existingUser!.email },
      process.env.JWT_KEY!
    );

    //store the jwt on the session object --> cookie-session will serialize this (base64 encoded) and send it off to the user's browser!
    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
