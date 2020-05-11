import request from 'supertest'; //fake a request to the express app
import { app } from '../../app';
import { signupHelper } from '../../test/authHelper';

// const createEvent = async () => {
//   const cookie = signupHelper();
//   const title = 'jgejkj';
//   const description = 'keginveugh';

//   //request to create a new event
//   await request(app).post('/api/events').set('Cookie', cookie).send({
//     title,
//     description,
//   });
// };

// it('can fetch a list of tickets', async () => {
//   await createEvent();
//   await createEvent();
//   await createEvent();

//   const response = await request(app).get('/api/events').send().expect(200);

//   //check the array of objects
//   expect(response.body.length).toEqual(3);
// });
