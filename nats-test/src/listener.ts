//program to listen to events
//create a subscription for a channel, and listen to it

import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { PostCreatedListener } from './events/post-created-listener';

//client id: random
const client = nats.connect('social-events', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});
//watch for a connect event (when the connection is established):
client.on('connect', () => {
  console.log('listener connected to nats');

  //define an event handler for anytime we disconnect a client from the running server (lose our connection to the server): end this process
  client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new PostCreatedListener(client).listen();
});

//manual close: 1. ctrl c on the window 2. manual restart
process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());
