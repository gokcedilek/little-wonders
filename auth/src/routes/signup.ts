import express, { Request, Response } from 'express';
import { body } from 'express-validator'; //check the body of the request - apply it as a middleware!
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';
import { signupUser } from '../middlewares/signup-user';
import { User } from '../models/user';

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
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = User.build({ email: email, password: password });

    await user.save();

    //generate the jwt
    const userJWT = jwt.sign(
      { user_id: user.id, user_email: user.email },
      process.env.JWT_KEY!
    );

    //store the jwt on the session object --> cookie-session will serialize this (base64 encoded) and send it off to the user's browser!
    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
