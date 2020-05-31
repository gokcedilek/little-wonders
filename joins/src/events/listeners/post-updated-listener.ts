import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PostUpdatedEvent } from '@gdsocialevents/common';
import { Post } from '../../models/post';
import { queueGroupName } from './queue-group-name';

//find the ticket that's being updated, update, save back
//**** also, need to make sure we are processing the post-update events in the correct order --> need to check the "version" of the post: compare the version in the incoming request and in the database!

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
  subject: Subjects.PostUpdated = Subjects.PostUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: PostUpdatedEvent['data'], msg: Message) {
    const { title, price, numPeople } = data;

    //const post = await Post.findById(data.id);
    //instead of just checking the id, check id+version with a custom helper query method!
    const post = await Post.findLastEvent(data);

    if (!post) {
      //if we don't find the post because the version # is wrong, this means that we are processing post-update events out of order, so throw an error and don't process the update!
      throw new Error('ticket not found');
      //if we throw an error and do not "ack" this event, nats will eventually re-assign this event to be processed (and it will be processed when it's in the right order)
    }

    post.set({ title, price, numPeople });
    await post.save(); //increment the version # by 1, so that we will end up with the correct version: before it was data.version - 1, with the save it will become data.version

    //event processed successfully
    msg.ack();
  }
}
