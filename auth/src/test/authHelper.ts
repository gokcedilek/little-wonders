//import this helper function into relevant test files
import request from 'supertest'; //fake a request to the express app
import { app } from '../app';

export const signupHelper = async () => {
  const email = 'test@test.com';
  const password = 'password';

  //signup
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
