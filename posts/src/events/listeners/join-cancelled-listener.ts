import { Listener, JoinCancelledEvent, Subjects } from '@gdsocialevents/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Post } from '../../models/post';
import { PostUpdatedPublisher } from '../publishers/post-updated-publisher';

export class JoinCancelledListener extends Listener<JoinCancelledEvent> {
  subject: Subjects.JoinCancelled = Subjects.JoinCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: JoinCancelledEvent['data'], msg: Message) {
    //find the post for the join
    const post = await Post.findById(data.post.id);

    //if no post, throw error
    if (!post) {
      throw new Error('post not found!');
    }

    //remove the join
    await Post.updateOne(
      {
        _id: post.id,
      },
      {
        $pull: {
          joinIds: data.id,
        },
        $set: {
          version: post.version + 1, //does the job of .save()
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
