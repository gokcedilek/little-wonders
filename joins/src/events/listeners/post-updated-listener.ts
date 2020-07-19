import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  PostUpdatedEvent,
  NotFoundError,
  eventListenerError,
} from '@gdsocialevents/common';
import { Post } from '../../models/post';
import { queueGroupName } from './queue-group-name';

//**** need to make sure we are processing the post-update events in the correct order --> need to check the "version" of the post: compare the version in the incoming request and in the database!

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
  subject: Subjects.PostUpdated = Subjects.PostUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: PostUpdatedEvent['data'], msg: Message) {
    const { title, description, userId, numPeople, location, time } = data;

    //instead of just checking the id, check id+version with a custom helper query method!
    try {
      const post = await Post.findLastPost(data);

      if (!post) {
        //if we don't find the post because the version # is wrong, this means that we are processing post-update events out of order, so throw an error and don't process the update!
        throw new NotFoundError('Post not found!');
        //if we throw an error and do not "ack" this event, nats will eventually re-assign this event to be processed (and it will be processed when it's in the right order)
      }

      post.set({ title, description, userId, numPeople, location, time });
      await post.save(); //increment the version by 1, so that we will end up with the correct version: before it was data.version - 1, with the save it will become data.version
      msg.ack();
    } catch (err) {
      eventListenerError(this.queueGroupName, this.subject, err);
    }
  }
}
