import { PostCreatedListener } from '../post-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { PostCreatedEvent } from '@gdsocialevents/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Post } from '../../../models/post';

const setup = async () => {
  //create an instance of the listener
  const listener = new PostCreatedListener(natsWrapper.theClient);

  //create a fake data event
  const data: PostCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'fksn',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    numPeople: 2,
  };

  //create a fake message event
  //pretend that this is a Message instance even if we did not implement the Message correctly
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    message,
  };
};

it('creates and saves a ticket', async () => {
  const { listener, data, message } = await setup();

  //call the onMessage function with the data object + message
  await listener.onMessage(data, message);

  //make sure the post was created
  const post = await Post.findById(data.id);
  expect(post).toBeDefined();
  expect(post!.title).toEqual(data.title);
  expect(post!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  //call the onMessage function with the data object + message
  await listener.onMessage(data, message);

  //make sure ack func is called
  expect(message.ack).toHaveBeenCalled();
});
