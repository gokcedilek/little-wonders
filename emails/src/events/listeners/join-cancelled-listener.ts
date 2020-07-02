import {
  Listener,
  JoinCancelledEvent,
  Subjects,
  eventListenerError,
} from '@gdsocialevents/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Mailer } from '../../services/Mailer';
import joinCancelledTemplate from '../../services/emailTemplates/joinCancelledTemplate';

export class JoinCancelledListener extends Listener<JoinCancelledEvent> {
  subject: Subjects.JoinCancelled = Subjects.JoinCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: JoinCancelledEvent['data'], msg: Message) {
    try {
      const mailer = new Mailer(
        {
          subject: 'miracle!',
          receiver: 'gokcebackup@gmail.com',
          //receiver: data.user.email,
        },
        joinCancelledTemplate(data)
      );

      await mailer.send();

      msg.ack();
    } catch (err) {
      eventListenerError(this.queueGroupName, this.subject, err);
    }
  }
}
