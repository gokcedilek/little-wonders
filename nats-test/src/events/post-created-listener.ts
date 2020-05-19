import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { PostCreatedEvent } from './post-created-event';
import { Subjects } from './subjects';

export class PostCreatedListener extends Listener<PostCreatedEvent> {
  subject: Subjects.PostCreated = Subjects.PostCreated; //define the type, AND the value of subject (subject type matches with that of subject defined in PostCreatedEvent)

  queueGroupName = 'payments-service';

  //PostCreatedEvent['data'] enforces type checking on the properties of data we are accessing
  onMessage(data: PostCreatedEvent['data'], msg: Message) {
    console.log('event data!', data);
    msg.ack();
  }
}
