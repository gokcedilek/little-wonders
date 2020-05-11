import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import mongoose from 'mongoose';
import { signupHelper } from '../../test/authHelper';

// it('returns 404 if the provided event id does not exist', async () => {
//   //user is authenticated, inputs are valid, but the event id doesnt exist

//   //generate an event id that doesnt exist
//   const id = new mongoose.Types.ObjectId().toHexString();

//   const cookie = signupHelper();
//   const response = await request(app)
//     .put(`/api/events/${id}`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'kebjgbj',
//       description: 'sjfwjb',
//     });
//   console.log(response.status);
// });

// it('returns 401 if the user is not authenticated', async () => {
//   //generate an event id that doesnt exist
//   const id = new mongoose.Types.ObjectId().toHexString();

//   //no cookie is provided - not authenticated
//   await request(app)
//     .put(`/api/events/${id}`)
//     .send({
//       title: 'kebjgbj',
//       description: 'sjfwjb',
//     })
//     .expect(401);
// });

it('returns 401 if the user does not own the event', async () => {
  //create an event as one user
  const cookie = signupHelper();
  const response = await request(app)
    .post('/api/events')
    .set('Cookie', cookie)
    .send({
      title: 'kebjgbj',
      description: 'sjfwjb',
    });
  //attempt to edit the same event (record id) as a different user
  const anotherCookie = signupHelper();
  await request(app)
    .put(`/api/events/${response.body.id}`)
    .set('Cookie', anotherCookie)
    .send({
      title: 'kebkjewjjgbj',
      description: 'hseow',
    })
    .expect(401);
});

// it('returns 400 if the user provides an invalid input');

// it('updates the ticket with valid inputs');
