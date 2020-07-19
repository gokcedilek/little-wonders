import {
  Listener,
  JoinCreatedEvent,
  Subjects,
  eventListenerError,
} from '@gdsocialevents/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Mailer } from '../../services/Mailer';
import joinCreatedTemplate from '../../services/emailTemplates/joinCreatedTemplate';

export class JoinCreatedListener extends Listener<JoinCreatedEvent> {
  subject: Subjects.JoinCreated = Subjects.JoinCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: JoinCreatedEvent['data'], msg: Message) {
    try {
      const mailer = new Mailer(
        {
          subject: 'Join Created!',
          receiver: 'gokcebackup@gmail.com',
          //receiver: data.user.email,
        },
        joinCreatedTemplate(data)
      );

      await mailer.send();

      msg.ack();
    } catch (err) {
      eventListenerError(this.queueGroupName, this.subject, err);
    }
  }
}
