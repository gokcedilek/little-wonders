//order-created event --> expiration queue to enqueue/create/publish a job (~event) --> send the job to the redis server --> redis stores the job with timer --> afterwards sends back to the expiration service queue --> service emits "expiration:complete"
import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

//properties(info stored) inside events(~jobs) --> apply this as a generic type to our queue
interface jobPayload {
  joinId: string;
}

//new queue: to publish, and process a job (~event)
//1st arg: name of the channel(list of jobs) 2nd arg: options
//the generic type specifies what kind of info will flow in our queue (jobPayload)
const expirationQueue = new Queue<jobPayload>('join:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

//what to do whenever we receive a job - after the redis server sent us the job ONCE THE TIMER HAS EXPIRED - publish expirationCompleteEvent!
expirationQueue.process(async (job) => {
  //job's data property is the info we are storing in the job - object matching the payload interface
  new ExpirationCompletePublisher(natsWrapper.theClient).publish({
    joinId: job.data.joinId,
  });
});

export { expirationQueue };
