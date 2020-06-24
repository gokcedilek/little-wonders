import { Listener, JoinCancelledEvent, Subjects } from '@gdsocialevents/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';

export class JoinCancelledListener extends Listener<JoinCancelledEvent> {
  subject: Subjects.JoinCancelled = Subjects.JoinCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: JoinCancelledEvent['data'], msg: Message) {
    //ack the message
    msg.ack();
  }
}
