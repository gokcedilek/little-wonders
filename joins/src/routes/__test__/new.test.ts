import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { Join, JoinStatus } from '../../models/join';
import { Post } from '../../models/post';
import { User } from '../../models/user';

it('returns an error if the post does not exist', async () => {
  const postId = mongoose.Types.ObjectId();
  const cookie = signupHelper('jsbkjs', 'jsks'); //user does NOT matter in this case
  await request(app)
    .post('/api/joins')
    .set('Cookie', cookie)
    .send({
      postId: postId,
    })
    .expect(404);
});

it('returns an error if the event is full', async () => {
  //create an event (post) with numPeople = 1, save to the db, then create a join for that post, save to the db, and then finally attempt to join again (the second one should fail because the event will have been full)
  const post = Post.build({
    title: 'concert',
    price: 10,
    numPeople: 1,
  });
  await post.save();

  const user = User.build({
    email: 't@test.com',
  });
  await user.save();

  const join = Join.build({
    user: user,
    status: JoinStatus.Created,
    expAt: new Date(),
    post: post,
  });
  await join.save();

  //attempt to join to a *full* event
  const cookie = signupHelper(user.id, user.email);
  await request(app)
    .post('/api/joins')
    .set('Cookie', cookie)
    .send({
      postId: post.id,
    })
    .expect(400);
});

it('adds a user for the event', async () => {
  //create an event (post) with numPeople = 1, save to the db, and then attempt to join the event (this should succeed because the event is not full!)
  const post = Post.build({
    title: 'concert',
    price: 10,
    numPeople: 1,
  });
  await post.save();

  const user = User.build({
    email: 't@test.com',
  });
  await user.save();

  //attempt to join to an event that is *not* full
  const cookie = signupHelper(user.id, user.email);
  await request(app)
    .post('/api/joins')
    .set('Cookie', cookie)
    .send({
      postId: post.id,
    })
    .expect(201);
});

it('adds a user for two events', async () => {
  const postOne = Post.build({
    title: 'concert',
    price: 10,
    numPeople: 3,
  });
  await postOne.save();

  const postTwo = Post.build({
    title: 'hello',
    price: 20,
    numPeople: 1,
  });
  await postTwo.save();

  const user = User.build({
    email: 't@test.com',
  });
  await user.save();

  //console.log('user id: ', user.id);
  //attempt to join to two events that are *not* full
  const cookie = signupHelper(user.id, user.email);
  await request(app)
    .post('/api/joins')
    .set('Cookie', cookie)
    .send({
      postId: postOne.id,
    })
    .expect(201);
  await request(app)
    .post('/api/joins')
    .set('Cookie', cookie)
    .send({
      postId: postTwo.id,
    })
    .expect(201);
});

it.todo('emits an order created event');
