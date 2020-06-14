import { Listener, JoinCreatedEvent, Subjects } from '@gdsocialevents/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class JoinCreatedListener extends Listener<JoinCreatedEvent> {
  subject: Subjects.JoinCreated = Subjects.JoinCreated;
  queueGroupName = queueGroupName;

  //create a job when we receive a joinCreatedEvent
  async onMessage(data: JoinCreatedEvent['data'], msg: Message) {
    //when a new join is created, create a new job and queue it

    //time btw the current time and data.exp (the time at which the join should expire) is the "delay" time
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('waiting this many ms to process a job: ', delay);

    //1st arg: job payload/data, 2nd arg: options obj
    await expirationQueue.add(
      {
        joinId: data.id, //join id coming from the joinCreatedEvent
      },
      {
        delay: delay, //ms: delay before we receive this job back from redis
      }
    );

    msg.ack();
  }
}
