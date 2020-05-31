import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';
import mongoose from 'mongoose';

it('returns a 404 if the event is not found', async () => {
  //id of the event does not exist
  const id = new mongoose.Types.ObjectId().toHexString(); //generate valid object id
  const response = await request(app)
    .get(`/api/posts/${id}`)
    .send()
    .expect(404);
  console.log(response.body);
});

it('returns the event if the event is found', async () => {
  const cookie = signupHelper();
  const title = 'jgejkj';
  const description = 'keginveugh';
  const price = 20;
  const numPeople = 1;

  //create a new event
  const post = await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({
      title,
      description,
      price,
      numPeople,
    })
    .expect(201);

  //attempt to retrieve the event we just created, using its id (note how we send an empty request-body for get requests!)
  const postResponse = await request(app)
    .get(`/api/posts/${post.body.id}`)
    .send()
    .expect(200);
  expect(postResponse.body.title).toEqual(title);
  expect(postResponse.body.description).toEqual(description);
});
