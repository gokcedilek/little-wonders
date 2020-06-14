import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
  NotAuthorizedError,
} from '@gdsocialevents/common';
import { newJoinRouter } from './routes/new';
import { showPostsRouter } from './routes/showPosts';
import { showUsersRouter } from './routes/showUsers';
import { deleteJoinRouter } from './routes/delete';
import { showJoinRouter } from './routes/show';

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
//for every single request that comes to our app, if the user is authenticated, we want to assign the req.currentUser property so that we will know about the user! (must come after cookieSession so that req.session will be attached to the request!) -- middleware that runs before every route handler!
app.use(currentUser);

app.use(newJoinRouter);
app.use(showPostsRouter);
app.use(showUsersRouter);
app.use(deleteJoinRouter);
app.use(showJoinRouter);

//a request on any method, on a route we don't recognise - throw 404
app.all('*', async (req, res) => {
  console.log('howcome??');
  //throw new NotFoundError();
  throw new NotAuthorizedError('howcome?');
});

app.use(errorHandler);

export { app };
