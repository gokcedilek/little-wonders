import { Listener, JoinCreatedEvent, Subjects } from '@gdsocialevents/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { JoinCreatedMailer } from '../../services/JoinCreatedMailer';
import joinCreatedTemplate from '../../services/emailTemplates/joinCreatedTemplate';

export class JoinCreatedListener extends Listener<JoinCreatedEvent> {
  subject: Subjects.JoinCreated = Subjects.JoinCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: JoinCreatedEvent['data'], msg: Message) {
    //send a join-created confirmation email
    const mailer = new JoinCreatedMailer(
      {
        subject: 'miracle!',
        receiver: 'gokcebackup@gmail.com',
        //receiver: data.user.email,
      },
      joinCreatedTemplate(data)
    );

    // const miracle = await mailer.send();
    // console.log('received a response!');
    // console.log(miracle);

    await mailer.send();

    //ack the message
    msg.ack();
  }
}
