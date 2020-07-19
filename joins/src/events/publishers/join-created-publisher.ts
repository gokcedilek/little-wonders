import { Publisher, Subjects, JoinCreatedEvent } from '@gdsocialevents/common';

export class JoinCreatedPublisher extends Publisher<JoinCreatedEvent> {
  subject: Subjects.JoinCreated = Subjects.JoinCreated;
}
