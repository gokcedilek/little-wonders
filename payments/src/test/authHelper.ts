//import this helper function into relevant test files
import request from 'supertest'; //fake a request to the express app
import { app } from '../app';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const signupHelper = () => {
  // const email = 'test@test.com';
  // const password = 'password';

  // const response = await request(app)
  //   .post('/api/users/signup')
  //   .send({
  //     email,
  //     password,
  //   })
  //   .expect(201);

  // const cookie = response.get('Set-Cookie');

  // return cookie;

  //obtaining a cookie synchronously: we cant introduce a dependency to our auth service from the other services (meaning that we shouldn't make a post request to auth-signup route handler as above) - so, we need to write a generic signUpHelper which simulates the process of obtaining a cookie:
  //1. build a jwt payload (user)
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  //2. create the jwt - jwt sign
  const userJWT = jwt.sign(
    { id: payload.id, email: payload.email },
    process.env.JWT_KEY!
  );
  //3. build the session object, turn into json {jwt: MY_JWT}
  const session = { jwt: userJWT };
  const sessionJSON = JSON.stringify(session);
  //4. take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //5. return a string that has the cookie with the encoded jwt data (supertest expects cookies in an array)
  return [`express:sess=${base64}`];
};
