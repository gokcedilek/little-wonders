import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PostCreatedEvent } from '@gdsocialevents/common';
import { Post } from '../../models/post';
import { queueGroupName } from './queue-group-name';

//save the info from the created post to our local copy of posts db inside the join service {data replication btw services}

export class PostCreatedListener extends Listener<PostCreatedEvent> {
  subject: Subjects.PostCreated = Subjects.PostCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PostCreatedEvent['data'], msg: Message) {
    const { id, title, price, numPeople } = data;
    const post = Post.build({
      id,
      title,
      price,
      numPeople,
    });
    await post.save();

    //event processed successfully
    msg.ack();
  }
}
