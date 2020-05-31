import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { PostCreatedListener } from './events/listeners/post-created-listener';
import { PostUpdatedListener } from './events/listeners/post-updated-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('MONGO_URI must be defined!');
  }

  try {
    //3rd arg, url: connect to the clusterIP service that is governing access to our nats deployment (pods)
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.theClient.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.theClient.close());
    process.on('SIGTERM', () => natsWrapper.theClient.close());

    //listen for incoming events that concern the joins-service
    new PostCreatedListener(natsWrapper.theClient).listen();
    new PostUpdatedListener(natsWrapper.theClient).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongodb!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  app.listen(4000, () => {
    console.log('listening on 4000!');
  });
};

start();

// let geocoder;
// let map;
// function codeAddress() {
//   var address = '';
//   geocoder.geocode({ address: address }, function (results, status) {
//     if (status == 'OK') {
//       map.setCenter(results[0].geometry.location);
//       var marker = new google.maps.Marker({
//         map: map,
//         position: results[0].geometry.location,
//       });
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//   });
// }
