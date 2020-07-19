import {
  Publisher,
  Subjects,
  JoinCancelledEvent,
} from '@gdsocialevents/common';

export class JoinCancelledPublisher extends Publisher<JoinCancelledEvent> {
  subject: Subjects.JoinCancelled = Subjects.JoinCancelled;
}
