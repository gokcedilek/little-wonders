import { Publisher, Subjects, PostCreatedEvent } from '@gdsocialevents/common';

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
  subject: Subjects.PostCreated = Subjects.PostCreated;
}
