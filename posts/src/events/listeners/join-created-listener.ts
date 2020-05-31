import { Listener, JoinCreatedEvent, Subjects } from '@gdsocialevents/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Post } from '../../models/post';
import { PostUpdatedPublisher } from '../publishers/post-updated-publisher';

export class JoinCreatedListener extends Listener<JoinCreatedEvent> {
  subject: Subjects.JoinCreated = Subjects.JoinCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: JoinCreatedEvent['data'], msg: Message) {
    //find the post for the join
    const post = await Post.findById(data.post.id);

    //if no post, throw error
    if (!post) {
      throw new Error('post not found!');
    }

    //add the join id to the joinIds property (mark the post as joined), and increment the version whenever we make a change to the post (since updateOne is not calling save(), we have to increment the version manually ourselves!)
    await Post.updateOne(
      {
        _id: post.id,
      },
      {
        $push: {
          joinIds: data.id,
        },
        $set: {
          version: post.version + 1,
        },
      }
    );

    //refetch the updated post, so that we will publish the event below with the correct values
    const updatedPost = await Post.findById(data.post.id);
    if (!updatedPost) {
      throw new Error('post not found!');
    }

    //publish an update event, so that the version update gets reflected to the joins service! (it will listen for this event) --> *a listener publishing an event!!*
    await new PostUpdatedPublisher(this.client).publish({
      id: updatedPost.id,
      version: updatedPost.version, //this is what has been changed inside this listener, so this is the reason why we need to publish a post-update event!
      title: updatedPost.title,
      price: updatedPost.price,
      userId: updatedPost.userId,
      numPeople: updatedPost.numPeople,
      joinIds: updatedPost.joinIds,
    });

    //ack the message
    msg.ack();
  }
}
