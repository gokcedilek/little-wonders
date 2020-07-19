import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

//make use of our mock file
jest.mock('../nats-wrapper'); //file we want to avoid using --> jest will redirect the imports of this file

let mongo: any;
//before all tests, create a new instance of mongo memory server: hook function
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

//before each test, reset all the data in the db (delete all collections)
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

  //mock funcs keep track of how many times they get called. before each test, we want to reset their data
  jest.clearAllMocks();
});

//stop the server, disconnect from it
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
