import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCreatedEvent } from '@gdsocialevents/common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

//save the info from the created post to our local copy of posts db inside the join service {data replication btw services}

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, email } = data;
    const user = User.build({
      id,
      email,
    });
    try {
      await user.save();
      msg.ack();
    } catch (err) {
      console.log('error!');
      console.log(err);
    }
  }
}
