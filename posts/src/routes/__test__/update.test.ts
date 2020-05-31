import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import mongoose from 'mongoose';
import { signupHelper } from '../../test/authHelper';
import { Post } from '../../models/post';

it('returns 404 if the provided event id does not exist', async () => {
  //user is authenticated, inputs are valid, but the event id doesnt exist

  //generate an event id that doesnt exist
  const id = new mongoose.Types.ObjectId().toHexString();

  const cookie = signupHelper();
  const response = await request(app)
    .put(`/api/posts/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'kebjgbj',
      description: 'sjfwjb',
      price: 20,
    })
    .expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
  //generate an event id that doesnt exist
  const id = new mongoose.Types.ObjectId().toHexString();

  //no cookie is provided - not authenticated
  await request(app)
    .put(`/api/posts/${id}`)
    .send({
      title: 'kebjgbj',
      description: 'sjfwjb',
      price: 20,
    })
    .expect(401);
});

it('returns 401 if the user does not own the event', async () => {
  //create an event as one user
  const cookie = signupHelper();
  const response = await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({
      title: 'kebjgbj',
      description: 'sjfwjb',
      price: 20,
      numPeople: 1,
    });
  //attempt to edit the same event (record id) as a different user
  const anotherCookie = signupHelper();
  await request(app)
    .put(`/api/posts/${response.body.id}`)
    .set('Cookie', anotherCookie)
    .send({
      title: 'kebkjewjjgbj',
      description: 'hseow',
      price: 10,
    })
    .expect(401);
});

// it('returns 400 if the user provides an invalid input');

// it('updates the ticket with valid inputs');

it('rejects updates if the post has been joined', async () => {
  //create a post
  const cookie = signupHelper();
  const response = await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({
      title: 'kebjgbj',
      description: 'sjfwjb',
      price: 20,
      numPeople: 1,
    });

  //create a fake join for the post
  // const post = await Post.findById(response.body.id);
  // const joinId = mongoose.Types.ObjectId().toHexString();
  // post!.joinIds.push(joinId);
  // await post!.save();

  //attempt to update the post when its been joined, should result in an error
  await request(app)
    .put(`/api/posts/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'kebkjewjjgbj',
      description: 'hseow',
      price: 10,
    })
    .expect(400);
});
