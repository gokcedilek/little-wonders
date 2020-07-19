import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';

it('responds with details about the current user', async () => {
  //sign up, then attempt to get the current user using the cookie
  const cookie = await signupHelper();

  //the cookie we get from the previous signup request does NOT automatically get included in the followup requests!!! --> we have to set the header Cookie to include the cookie!

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  console.log(response.body);
  expect(response.body.currentUser.user_email).toEqual('test@test.com');
});
