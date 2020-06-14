import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { Join, JoinStatus } from '../../models/join';
import { Post } from '../../models/post';
import { User } from '../../models/user';

// const createPost = async (title: string, num: number) => {
//   const post = Post.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     title: title,
//     price: 10,
//     numPeople: num,
//   });
//   await post.save();
//   return post;
// };

// const createUser = async () => {
//   const user = User.build({
//     email: 't@test.com',
//   });
//   await user.save();
//   return user;
// };

// it('fetches users who signed up for a particular event/post', async () => {
//   //create two posts + three users
//   const postOne = await createPost('postOne', 3);
//   const postTwo = await createPost('postTwo', 2);

//   const userOne = await createUser();
//   const userTwo = await createUser();
//   const userThree = await createUser();

//   const cookieOne = signupHelper(userOne.id, userOne.email);
//   const cookieTwo = signupHelper(userTwo.id, userTwo.email);
//   const cookieThree = signupHelper(userThree.id, userThree.email);

//   //create 3 joins for post#1
//   await request(app)
//     .post('/api/joins')
//     .set('Cookie', cookieOne)
//     .send({ postId: postOne.id })
//     .expect(201);

//   await request(app)
//     .post('/api/joins')
//     .set('Cookie', cookieTwo)
//     .send({ postId: postOne.id })
//     .expect(201);

//   await request(app)
//     .post('/api/joins')
//     .set('Cookie', cookieThree)
//     .send({ postId: postOne.id })
//     .expect(201);

//   //create 2 joins for post#2
//   await request(app)
//     .post('/api/joins')
//     .set('Cookie', cookieOne)
//     .send({ postId: postTwo.id })
//     .expect(201);

//   await request(app)
//     .post('/api/joins')
//     .set('Cookie', cookieTwo)
//     .send({ postId: postTwo.id })
//     .expect(201);

//   //make request to get joins for post #1 and for post #2 (NOTE: right now the user who accesses this route does not matter, being authenticated is now, so just send off with cookieOne)
//   const responseOne = await request(app)
//     .get(`/api/joins/${postOne.id}`)
//     .set('Cookie', cookieOne)
//     .send()
//     .expect(200);

//   const responseTwo = await request(app)
//     .get(`/api/joins/${postTwo.id}`)
//     .set('Cookie', cookieOne)
//     .send()
//     .expect(200);

//   //make sure we got 3 users for post#1, and 2 users for post#2
//   expect(responseOne.body.length).toEqual(3);
//   expect(responseTwo.body.length).toEqual(2);

//   console.log(responseOne.body);
//   console.log(responseTwo.body);

//   // expect(responseOne.body[0].post.title).toEqual(responseOne.body.post.title);
//   // expect(response.body[1].post.title).toEqual(responseTwo.body.post.title);
// });
