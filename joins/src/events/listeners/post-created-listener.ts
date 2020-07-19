import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  PostCreatedEvent,
  eventListenerError,
} from '@gdsocialevents/common';
import { Post } from '../../models/post';
import { queueGroupName } from './queue-group-name';

//save the info from the created post to our local copy of posts db inside the join service {data replication btw services}

export class PostCreatedListener extends Listener<PostCreatedEvent> {
  subject: Subjects.PostCreated = Subjects.PostCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PostCreatedEvent['data'], msg: Message) {
    const { id, title, description, userId, numPeople, location, time } = data;
    const post = Post.build({
      id,
      title,
      description,
      userId,
      numPeople,
      location,
      time,
    });

    //if something goes wrong, don't ack the message
    try {
      await post.save();
      msg.ack();
    } catch (err) {
      eventListenerError(this.queueGroupName, this.subject, err);
    }
  }
}
