import { natsWrapper } from './nats-wrapper';
import { JoinCreatedListener } from './events/listeners/join-created-listener';

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('MONGO_URI must be defined!');
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

    new JoinCreatedListener(natsWrapper.theClient).listen();
  } catch (error) {
    console.error(error);
  }
};

//start();
