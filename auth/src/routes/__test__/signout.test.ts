import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  //sign out after signing up
  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  console.log(response.get('Set-Cookie'));

  expect(response.get('Set-Cookie')).toBeDefined();
});
