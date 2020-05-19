import nats, { Stan } from 'node-nats-streaming';

//don't export the whole class
class NatsWrapper {
  //define this _client property AFTER we connect to nats and get back a client. we will then assign that client as the value of _client! //? : this property might be undefined
  private client?: Stan;

  //access the private client using a getter, and if we try to use the client before we connect, throw an error
  //we use a getter like so: this.client
  get theClient() {
    if (!this.client) {
      throw new Error(
        'cannot access NATS client before connecting to the NATS server!'
      );
    }
    return this.client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this.client = nats.connect(clusterId, clientId, { url });

    //IMPORTANT: in order to be able to use async, await with the connect function, we NEED TO RETURN A PROMISE!!!
    return new Promise((resolve, reject) => {
      this.theClient.on('connect', () => {
        console.log('connected to NATS!');
        resolve();
      });
      this.theClient.on('error', (error) => {
        reject(error);
      });
    });
  }
}

//export a single instance of the class, share this instance across the whole project!
export const natsWrapper = new NatsWrapper();
