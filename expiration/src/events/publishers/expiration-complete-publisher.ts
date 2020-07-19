import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@gdsocialevents/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
