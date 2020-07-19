import { Publisher } from './base-publisher';
import { PostCreatedEvent } from './post-created-event';
import { Subjects } from './subjects';

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
  subject: Subjects.PostCreated = Subjects.PostCreated;
}
