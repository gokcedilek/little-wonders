import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { Join, JoinStatus } from '../../models/join';
import { Post } from '../../models/post';
import { User } from '../../models/user';

const createPost = async (title: string, num: number) => {
  const post = Post.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: title,
    price: 10,
    numPeople: num,
  });
  await post.save();
  return post;
};

const createUser = async () => {
  const user = User.build({
    email: 't@test.com',
  });
  await user.save();
  return user;
};

it('marks a join as cancelled, given a post id and the current user', async () => {
  //create two posts + three users
  const postOne = await createPost('postOne', 3);
  const postTwo = await createPost('postTwo', 2);

  const userOne = await createUser();
  const userTwo = await createUser();

  const cookieOne = signupHelper(userOne.id, userOne.email);
  const cookieTwo = signupHelper(userTwo.id, userTwo.email);

  //create 3 joins: u1 and u2 for post#1, and u2 for post#2
  await request(app)
    .post('/api/joins')
    .set('Cookie', cookieOne)
    .send({ postId: postOne.id })
    .expect(201);

  await request(app)
    .post('/api/joins')
    .set('Cookie', cookieTwo)
    .send({ postId: postOne.id })
    .expect(201);

  await request(app)
    .post('/api/joins')
    .set('Cookie', cookieTwo)
    .send({ postId: postTwo.id })
    .expect(201);

  //make request to delete u2's join for post#1 only
  const responseOne = await request(app)
    .delete(`/api/joins/${postOne.id}`)
    .set('Cookie', cookieTwo)
    .send()
    .expect(204);

  //console.log(responseOne);

  //get the users for post#1 (there should only be user1)
  const resOne = await request(app)
    .get(`/api/joins/${postOne.id}`)
    .set('Cookie', cookieTwo)
    .send()
    .expect(200);
  console.log(resOne.body);

  //get the users for post#2 (there should only be user2)
  const resTwo = await request(app)
    .get(`/api/joins/${postTwo.id}`)
    .set('Cookie', cookieTwo)
    .send()
    .expect(200);
  console.log(resTwo.body);
});

it('emits an order cancelled event', async () => {
  //one post, one user
  const postOne = await createPost('postOne', 3);
  const userOne = await createUser();
  const cookieOne = signupHelper(userOne.id, userOne.email);

  //user joins to the post
  await request(app)
    .post('/api/joins')
    .set('Cookie', cookieOne)
    .send({ postId: postOne.id })
    .expect(201);

  //cancel user's join to the post
  const responseOne = await request(app)
    .delete(`/api/joins/${postOne.id}`)
    .set('Cookie', cookieOne)
    .send()
    .expect(204);

  expect(natsWrapper.theClient.publish).toHaveBeenCalled();
});
