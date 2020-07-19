//program to publish events
import nats from 'node-nats-streaming';
import { PostCreatedPublisher } from './events/post-created-publisher';
//create client: will connect to the nats server and exchange info with it (stan: client), client-id: 'abc'
const client = nats.connect('social-events', 'abc', {
  url: 'http://localhost:4222',
});
//instead of async await, need to make use of an event-based async handling (event-listening, callback funcs): wait for the connect event!
client.on('connect', async () => {
  console.log('publisher connected to nats');

  const publisher = new PostCreatedPublisher(client);

  try {
    await publisher.publish({
      id: 'kshjks',
      title: 'sjdksjbg',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

  // //we can only share strings (called a message)
  // const event = JSON.stringify({
  //   id: 'kjbfk',
  //   title: 'kjfwkb',
  // });

  // //publish to a channel (channel = subject)
  // client.publish('post:created', event, () => {
  //   //invoked after we publish data
  //   console.log('event creation published!');
  // });
});
