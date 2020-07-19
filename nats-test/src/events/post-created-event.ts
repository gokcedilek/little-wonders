import { Subjects } from './subjects';

//coupling between subject name & structure(properties) of the associated event needs to be enforced inside of listeners
export interface PostCreatedEvent {
  subject: Subjects.PostCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
