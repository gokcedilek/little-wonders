import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

//describe a generic kind of event
interface Event {
  subject: Subjects;
  data: any;
}

//abstract: subclass needs to define, private: subclass cannot change, protected: subclass can define if it wants to
//<T extends Event>: Listener becomes a "generic class", we have to provide a custom type T to it
export abstract class Listener<T extends Event> {
  abstract subject: T['subject']; //the channel listener listens to
  abstract queueGroupName: string; //the queue group listener joins
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  protected ackWait = 5 * 1000; //5s

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true) //when an event is received, do not automatically tell the nats server that we processed the event --> we need to acknowledge the event manually!
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable() //whenever our subscription is created ((re)start a listener), nats server will send all the events that have been emitted before this subscription was created for the **first time only** (because all the events emitted at this stage will be unprocessed)!
      .setDurableName(this.queueGroupName); //durable name/id: for the second/third/etc recreation, only fetch the events that have "unprocessed" flag -- as opposed to setDeliverAll, don't fetch every single event everytime we re-start the subscription.
  }

  listen() {
    //subscribe to channel(s) {subject = name of the channel}
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received from channel: ${this.subject} / ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }

  abstract onMessage(data: T['data'], msg: Message): any;
}
