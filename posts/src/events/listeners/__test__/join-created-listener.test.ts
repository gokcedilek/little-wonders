import { JoinCreatedListener } from '../join-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Post } from '../../../models/post';
import { JoinCreatedEvent, JoinStatus } from '@gdsocialevents/common';
import mongoose, { Mongoose } from 'mongoose';
import { Message } from 'node-nats-streaming';

const createPost = async () => {
  //create and save a post
  const post = Post.build({
    title: 'skjks',
    description: 'kss',
    numPeople: 10,
    price: 10,
    userId: 'kkj',
  });
  await post.save();

  return post;
};

const createJoinData = async (id: string, price: number) => {
  //create the fake data event (join-created-event)
  const data: JoinCreatedEvent['data'] = {
    //data for a "join"
    id: mongoose.Types.ObjectId().toHexString(), //join id
    version: 0,
    status: JoinStatus.Created,
    userId: 'jskgnk',
    expiresAt: 'jskds',
    post: {
      id,
      price,
    },
  };
  return data;
};

const setup = () => {
  const listener = new JoinCreatedListener(natsWrapper.theClient);
  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, message };
};

it('adds one join to the post, acks the message once', async () => {
  const post = await createPost();
  const { listener, message } = setup();

  //create one join
  const data = await createJoinData(post.id, post.price);
  await listener.onMessage(data, message);

  //fetch the updated post
  const updatedPost = await Post.findById(post.id);
  expect(updatedPost!.joinIds).toEqual(expect.arrayContaining([data.id]));
  expect(message.ack).toHaveBeenCalledTimes(1);
});

it('adds three joins to the post, acks the message three times', async () => {
  const post = await createPost();
  const { listener, message } = setup();

  //create first join
  const dataOne = await createJoinData(post.id, post.price);
  await listener.onMessage(dataOne, message);

  //create second join
  const dataTwo = await createJoinData(post.id, post.price);
  await listener.onMessage(dataTwo, message);

  //create third join
  const dataThree = await createJoinData(post.id, post.price);
  await listener.onMessage(dataThree, message);

  //fetch the updated post
  const updatedPost = await Post.findById(post.id);
  expect(updatedPost!.joinIds).toEqual(expect.arrayContaining([dataOne.id]));
  expect(updatedPost!.joinIds).toEqual(expect.arrayContaining([dataTwo.id]));
  expect(updatedPost!.joinIds).toEqual(expect.arrayContaining([dataThree.id]));
  expect(message.ack).toHaveBeenCalledTimes(3);
});

it('publishes a post updated event', async () => {
  const post = await createPost();
  const { listener, message } = setup();

  //create one join
  const data = await createJoinData(post.id, post.price);
  await listener.onMessage(data, message);

  //use the publish mock function to make sure we have published a post-updated event, with the correct parameters
  expect(natsWrapper.theClient.publish).toHaveBeenCalled();
  //tell ts that this is a jest mock function, so that we can get access to its properties
  const postUpdatedData = JSON.parse(
    (natsWrapper.theClient.publish as jest.Mock).mock.calls[0][1]
  );

  //fetch the updated post
  const updatedPost = await Post.findById(post.id);
  expect(postUpdatedData.joinIds).toEqual(expect.arrayContaining([data.id]));
});
