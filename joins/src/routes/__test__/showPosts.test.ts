import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { Join, JoinStatus } from '../../models/join';
import { Post } from '../../models/post';
import { User } from '../../models/user';

const createPost = async (title: string) => {
  const post = Post.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: title,
    price: 10,
    numPeople: 1,
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

it('fetches posts for a particular user', async () => {
  //create three posts + two users
  const postOne = await createPost('postOne');
  const postTwo = await createPost('postTwo');
  const postThree = await createPost('postThree');

  const userOne = await createUser();
  const userTwo = await createUser();

  const cookieOne = signupHelper(userOne.id, userOne.email);
  const cookieTwo = signupHelper(userTwo.id, userTwo.email);

  //create one join as user#1
  await request(app)
    .post('/api/joins')
    .set('Cookie', cookieOne)
    .send({ postId: postOne.id })
    .expect(201);

  //create two joins as user#2
  const responseOne = await request(app)
    .post('/api/joins')
    .set('Cookie', cookieTwo)
    .send({ postId: postTwo.id })
    .expect(201);
  const responseTwo = await request(app)
    .post('/api/joins')
    .set('Cookie', cookieTwo)
    .send({ postId: postThree.id })
    .expect(201);

  //make request to get joins for user#2
  const response = await request(app)
    .get('/api/joins')
    .set('Cookie', cookieTwo)
    .expect(200);

  //make sure we only got two joins
  expect(response.body.length).toEqual(2);
  expect(response.body[0].post.title).toEqual(responseOne.body.post.title);
  expect(response.body[1].post.title).toEqual(responseTwo.body.post.title);
});
