import { JoinCancelledListener } from '../join-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Post } from '../../../models/post';
import { JoinCancelledEvent, JoinStatus } from '@gdsocialevents/common';
import mongoose, { Mongoose, modelNames } from 'mongoose';
import { Message } from 'node-nats-streaming';

const cancelJoinData = async (joinId: string, postId: string) => {
  //create the fake data event (join-created-event)
  const data: JoinCancelledEvent['data'] = {
    //data for a "join"
    id: joinId,
    version: 0,
    post: {
      id: postId,
    },
  };
  return data;
};

const setup = () => {
  const listener = new JoinCancelledListener(natsWrapper.theClient);
  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, message };
};

it('creates two joins for a post, cancels one, publishes an event, acks the message', async () => {
  //create a post and two joins for it
  const post = Post.build({
    title: 'skjks',
    description: 'kss',
    numPeople: 10,
    price: 10,
    userId: 'kkj',
  });

  const joinIdOne = mongoose.Types.ObjectId().toHexString();

  const joinIdTwo = mongoose.Types.ObjectId().toHexString();

  post.joinIds.push(joinIdOne);
  post.joinIds.push(joinIdTwo);
  await post.save();

  const { listener, message } = setup();

  //cancel a join (the first one)
  const data = await cancelJoinData(joinIdOne, post.id);
  await listener.onMessage(data, message);

  //
  const updatedPost = await Post.findById(post.id);
  expect(updatedPost!.joinIds).toEqual(expect.arrayContaining([joinIdTwo]));
  expect(updatedPost!.joinIds).not.toEqual(expect.arrayContaining([joinIdOne]));
  console.log(updatedPost!.joinIds);
  expect(natsWrapper.theClient.publish).toHaveBeenCalled();
  expect(message.ack).toHaveBeenCalled();
});
