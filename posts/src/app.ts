import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@gdsocialevents/common';
import { newPostRouter } from './routes/new-post';
import { showPostRouter } from './routes/show-post';
import { indexPostsRouter } from './routes/index-posts';
import { updatePostRouter } from './routes/update-post';
import { userPostsRouter } from './routes/user-posts';

const app = express();
app.set('trust proxy', true); //trust traffic coming from ingress-nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, //not encrypted, because JWTs are!
    //secure: true, //cookies will only be used on an https connection (do not use cookies over an http connection)
    secure: process.env.NODE_ENV !== 'test', //if test, secure is false, so we set cookies over both https AND ALSO (insecure) http connections!
  })
);
//for every single request that comes to our app, if the user is authenticated, we want to assign the req.currentUser property so that we will know about the user! (must come after cookieSession so that req.session will be attached to the request!) -- middleware that runs before every route handler!
app.use(currentUser);

app.use(newPostRouter);
app.use(showPostRouter);
app.use(indexPostsRouter);
app.use(updatePostRouter);
app.use(userPostsRouter);

//a request on any method, on a route we don't recognise - throw 404
app.all('*', async (req, res) => {
  throw new NotFoundError('This route does not exist!');
});

app.use(errorHandler);

export { app };
