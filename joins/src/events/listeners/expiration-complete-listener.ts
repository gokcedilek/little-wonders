import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  JoinStatus,
} from '@gdsocialevents/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Join } from '../../models/join';
import { JoinCancelledPublisher } from '../publishers/join-cancelled-publisher';

// export class ExpirationCompleteListener extends Listener<
//   ExpirationCompleteEvent
// > {
//   subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
//   queueGroupName = queueGroupName;

//   async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
//     //a join has expired:
//     const join = await Join.findById(data.joinId).populate('post');
//     if (!join) {
//       throw new Error('join not found!');
//     }

//     //check if join has been completed, if it has, don't cancel it!
//     if (join.status === JoinStatus.Complete) {
//       return msg.ack();
//     }

//     //otherwise, update the status of the join
//     join.set({
//       status: JoinStatus.Cancelled,
//     });

//     await join.save();

//     //publish JoinCancelled
//     await new JoinCancelledPublisher(this.client).publish({
//       id: join.id,
//       version: join.version,
//       post: {
//         id: join.post.id,
//       },
//     });

//     msg.ack();
//   }
// }
