import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { JoinCreatedListener } from './events/listeners/join-created-listener';
import { JoinCancelledListener } from './events/listeners/join-cancelled-listener';
import { JoinConfirmedListener } from './events/listeners/join-confirmed-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.GMAPS_KEY) {
    throw new Error('GMAPS_KEY must be defined!');
  }

  try {
    //3rd arg, url: connect to the clusterIP service that is governing access to our nats deployment (pods)
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.theClient.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.theClient.close());
    process.on('SIGTERM', () => natsWrapper.theClient.close());

    //new JoinCreatedListener(natsWrapper.theClient).listen();
    new JoinCancelledListener(natsWrapper.theClient).listen();
    new JoinConfirmedListener(natsWrapper.theClient).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongodb!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  app.listen(4000, () => {
    console.log('listening on 4000!');
  });
};

start();
