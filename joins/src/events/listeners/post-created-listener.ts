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
    //console.log('saving post to joins with: ', id, title, price, numPeople);
    const post = Post.build({
      id,
      title,
      price,
      numPeople,
    });
    //console.log('whats happening?');
    console.log(post);
    //const res = await post.save();
    try {
      await post.save();
    } catch (err) {
      console.log('error!');
      console.log(err);
    }
    msg.ack();
  }
}
