import { Publisher, Subjects, PostUpdatedEvent } from '@gdsocialevents/common';

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
  subject: Subjects.PostUpdated = Subjects.PostUpdated;
}
