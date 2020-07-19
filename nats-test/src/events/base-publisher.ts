import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

//describe a generic kind of event
interface Event {
  subject: Subjects;
  data: any;
}

//generic class: enforce type checking
export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    //resolve: promise completed successfully --> published an event without an error, reject --> publish callback function has an error
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('event published!');
        resolve(); //resolved with void/nothing
      });
    });
  }
}
