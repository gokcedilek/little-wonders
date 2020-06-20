import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@gdsocialevents/common';

const app = express();
app.set('trust proxy', true); //trust traffic coming from ingress-nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, //not encrypted - JWTs are!
    //secure: true, //cookies will only be used on an https connection (do not use cookies over an http connection)
    secure: process.env.NODE_ENV !== 'test', //if test, secure is false, so we set cookies over both https AND ALSO (insecure) http connections!
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('This route does not exist!');
});

app.use(errorHandler);

export { app };
