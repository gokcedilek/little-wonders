import { Listener, JoinCancelledEvent, Subjects } from '@gdsocialevents/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Mailer } from '../../services/Mailer';
import joinCancelledTemplate from '../../services/emailTemplates/joinCancelledTemplate';

export class JoinCancelledListener extends Listener<JoinCancelledEvent> {
  subject: Subjects.JoinCancelled = Subjects.JoinCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: JoinCancelledEvent['data'], msg: Message) {
    const mailer = new Mailer(
      {
        subject: 'miracle!',
        receiver: 'gokcebackup@gmail.com',
        //receiver: data.user.email,
      },
      joinCancelledTemplate(data)
    );

    // const miracle = await mailer.send();
    // console.log(miracle);

    await mailer.send(); //try-catch!!!!
    //ack the message
    msg.ack();
  }
}
