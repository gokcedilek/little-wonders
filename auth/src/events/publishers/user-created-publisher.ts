import { Publisher, Subjects, UserCreatedEvent } from '@gdsocialevents/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
