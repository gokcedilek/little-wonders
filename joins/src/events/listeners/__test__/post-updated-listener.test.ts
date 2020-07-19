import { PostUpdatedListener } from '../post-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { PostUpdatedEvent } from '@gdsocialevents/common';
import mongoose, { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Post } from '../../../models/post';

const setup = async () => {
  //create a listener
  const listener = new PostUpdatedListener(natsWrapper.theClient);

  //create and save a post (since we are testing the post-updated listener, we will have to first manually create a post ourselves --> essentially replicate what the post-created listener is doing for us)
  const post = Post.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    numPeople: 2,
  });
  await post.save();

  //create a fake data object (want to update the same post we've created above, so use post.id)
  const data: PostUpdatedEvent['data'] = {
    version: post.version + 1, //this is what our db will do, we are simulating that behaviour (version + 1)
    id: post.id,
    title: 'new concert',
    price: 15, //different price
    userId: 'kjsk',
    numPeople: 2,
  };

  //create a fake msg object
  //pretend that this is a Message instance even if we did not implement the Message correctly
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    message,
    post,
  };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, post, message } = await setup();

  //call onMessage to update the post
  await listener.onMessage(data, message); //will update the post with the "data" provided to it

  //expect that the post has been updated
  const updatedPost = await Post.findById(post.id);
  //the new properties should be the same as the input update data
  expect(updatedPost!.title).toEqual(data.title);
  expect(updatedPost!.price).toEqual(data.price);
  expect(updatedPost!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  //call the onMessage function with the data object + message
  await listener.onMessage(data, message);

  //make sure ack func is called: showing that the post-update event has been processed normally
  expect(message.ack).toHaveBeenCalled();
});

it('does not call ack if the post has a skipped version #', async () => {
  const { listener, data, message } = await setup();

  //set data.version to a "future" version, before updating the post using this data --> note that if we don't do this, data.version is accurate (it is post.version + 1)! so without this line, we would expect the test to pass --> this line is what creates the difference!
  data.version = 10;

  //(attempt to) update the post
  try {
    await listener.onMessage(data, message);
  } catch (err) {
    //success
  }

  //expect we didn't ack the event
  expect(message.ack).not.toHaveBeenCalled();
});
