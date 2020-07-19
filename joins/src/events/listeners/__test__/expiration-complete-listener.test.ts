import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteEvent, JoinStatus } from '@gdsocialevents/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Post } from '../../../models/post';
import { Join } from '../../../models/join';
import { User } from '../../../models/user';

//what we want to test: call listener.onMessage, which simulates what would happen upon an ExpirationComplete event - we should set join-status to Cancelled, and also publish a JoinCancelled event!
const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.theClient);

  const post = Post.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'fksn',
    price: 10,
    numPeople: 2,
  });

  await post.save();

  const user = User.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'sgknsk',
  });

  await user.save();

  const join = Join.build({
    status: JoinStatus.Created,
    user: user,
    expAt: new Date(),
    post: post,
  });

  await join.save();

  const data: ExpirationCompleteEvent['data'] = {
    joinId: join.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { post, user, join, listener, data, msg };
};

it('updates the join status to cancelled', async () => {
  const { listener, join, post, data, msg } = await setup();
  await listener.onMessage(data, msg);

  //fetch the join from the db, check if status is updated
  const updatedJoin = await Join.findById(join.id);
  expect(updatedJoin!.status).toEqual(JoinStatus.Cancelled);
});

it('emits an JoinCancelled event', async () => {
  const { listener, join, post, data, msg } = await setup();
  await listener.onMessage(data, msg);

  //mock natsWrapper mock has a mock publish function -- need to check if this gets called
  const mockFunc = natsWrapper.theClient.publish as jest.Mock;
  expect(mockFunc).toHaveBeenCalled();

  const firstPublish = mockFunc.mock.calls[0];
  const eventData = JSON.parse(firstPublish[1]); //convert JSON to object (eventData is an object) so that we can pull the join-id property out of it!
  expect(eventData.id).toEqual(join.id);
});

it('acks the message', async () => {
  const { listener, join, post, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
