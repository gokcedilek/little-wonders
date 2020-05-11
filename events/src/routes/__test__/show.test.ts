import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';
import mongoose from 'mongoose';

// it('returns a 404 if the event is not found', async () => {
//   //id of the event does not exist
//   const id = new mongoose.Types.ObjectId().toHexString(); //generate valid object id
//   const response = await request(app)
//     .get(`/api/events/${id}`)
//     .send()
//     .expect(404);
//   console.log(response.body);
// });

// it('returns the event if the event is found', async () => {
//   const cookie = signupHelper();
//   const title = 'jgejkj';
//   const description = 'keginveugh';

//   //create a new event
//   const event = await request(app)
//     .post('/api/events')
//     .set('Cookie', cookie)
//     .send({
//       title,
//       description,
//     })
//     .expect(201);

//   //attempt to retrieve the event we just created, using its id (note how we send an empty request-body for get requests!)
//   const eventResponse = await request(app)
//     .get(`/api/events/${event.body.id}`)
//     .send()
//     .expect(200);
//   expect(eventResponse.body.title).toEqual(title);
//   expect(eventResponse.body.description).toEqual(description);
// });
