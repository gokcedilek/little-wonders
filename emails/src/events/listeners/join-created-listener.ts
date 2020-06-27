import { Listener, JoinCreatedEvent, Subjects } from '@gdsocialevents/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Mailer } from '../../services/Mailer';
import joinCreatedTemplate from '../../services/emailTemplates/joinCreatedTemplate';

export class JoinCreatedListener extends Listener<JoinCreatedEvent> {
  subject: Subjects.JoinCreated = Subjects.JoinCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: JoinCreatedEvent['data'], msg: Message) {
    //send a join-created confirmation email
    const mailer = new Mailer(
      {
        subject: 'miracle!',
        receiver: 'gokcebackup@gmail.com',
        //receiver: data.user.email,
      },
      joinCreatedTemplate(data)
    );

    // const miracle = await mailer.send();
    // console.log(miracle);

    await mailer.send(); //try-catch!!!!

    //ack the message
    msg.ack();
  }
}
