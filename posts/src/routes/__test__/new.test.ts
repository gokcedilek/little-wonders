import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';
import { Post } from '../../models/post';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/posts for post requests', async () => {
  const response = await request(app).post('/api/posts').send({});
  expect(response.status).not.toEqual(404);
});

it('cannot be accessed if the user is NOT signed in', async () => {
  await request(app).post('/api/posts').send({}).expect(401); //401 is the notAuthorized error code!
});

it('can be accessed if the user is signed in', async () => {
  //before trying to access the route, attach a fake cookie to the request to simulate a user as signed in
  const cookie = signupHelper();
  const response = await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({});
  //console.log(response.status);
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid input is provided', async () => {
  //check
  const cookie = signupHelper();
  const response = await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({
      title: '',
      description: '',
      dateTime: '',
      location: '',
    })
    .expect(400); //all these checker middlewares should return 400!
});
// it('returns an error if an invalid date or time is provided', async () => {});

// it('returns an error if an invalid location is provided', async () => {});

it('creates an event with valid inputs', async () => {
  //check if an event was saved to the db!
  let posts = await Post.find({}); //get all the events that exist in the collection
  expect(posts.length).toEqual(0);
  const cookie = signupHelper();
  await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({
      title: 'jkke',
      description: 'jkwjgri',
      price: 20,
    })
    .expect(201);
  posts = await Post.find({});
  expect(posts.length).toEqual(1);
  expect(posts[0].title).toEqual('jkke');
  expect(posts[0].description).toEqual('jkwjgri');
});

it('publishes an event when a valid post is created', async () => {
  const cookie = signupHelper();
  await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({
      title: 'jkke',
      description: 'jkwjgri',
      price: 20,
    })
    .expect(201);

  //check that the event publish func was called:
  expect(natsWrapper.theClient.publish).toHaveBeenCalled();
});
