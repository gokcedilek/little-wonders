import {
  Publisher,
  Subjects,
  JoinConfirmedEvent,
} from '@gdsocialevents/common';

export class JoinConfirmedPublisher extends Publisher<JoinConfirmedEvent> {
  subject: Subjects.JoinConfirmed = Subjects.JoinConfirmed;
}
