import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';

const createPost = async () => {
  const cookie = signupHelper();
  const title = 'jgejkj';
  const description = 'keginveugh';
  const price = 20;
  const numPeople = 1;

  //request to create a new event
  await request(app).post('/api/posts').set('Cookie', cookie).send({
    title,
    description,
    price,
    numPeople,
  });
};

it('can fetch a list of tickets', async () => {
  await createPost();
  await createPost();
  await createPost();

  const response = await request(app).get('/api/posts').send().expect(200);

  //check the array of objects
  expect(response.body.length).toEqual(3);
});
