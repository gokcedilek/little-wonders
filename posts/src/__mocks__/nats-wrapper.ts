//runs instead of the actual nats-wrapper file
export const natsWrapper = {
  // //what base-publisher does with the client: call the client's publish function with 3 args, and the callback function will eventually be invoked by the client (once it publishes successfully) - so, we will call the callback function immediately: this publish function will be invoked INSTEAD of the real publish function!
  // theClient: {
  //   publish: (subject: string, data: string, callback: () => void) => {
  //     callback(); //remember the client will eventually call the callback func argument, we are mimicking that behaviour!
  //   },
  // },

  //jest mock function (jest.fn()): we want to ensure that the publish func of the client gets executed (which shows the event is published). to check for that, we will use a mock function, and "expect" it to get called! jest.fn() has a bunch of helper funcs to allow us to check for that
  theClient: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
