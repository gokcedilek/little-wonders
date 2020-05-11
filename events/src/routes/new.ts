//create a new event
import express, { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@gdsocialevents/common';
import { body } from 'express-validator';
import { validateRequest } from '@gdsocialevents/common';
import moment from 'moment';
import { Client, Status } from '@googlemaps/google-maps-services-js';
//import {GeoCodingService} from '../../GeoCodingService'
import { Event } from '../models/event';

const router = express.Router();

const userValidationRules = () => {
  return [
    body('title').not().isEmpty().withMessage('title is required!'),
    body('description').not().isEmpty().withMessage('description is required!'),
  ];
};

// USAGE
// new GeoCodingService().geocodeAddress().then((results) => {
//   console.log('results', results);

//   const result = response.json.results[0],
//     location = result.geometry.location;

//   // @types/googlemaps describe the Javascript API not the JSON object on the response
//   // there a sublte difference like lat/lng beeing number not functions, making this `<any>` cast necessary
//   resolve({
//     lat: <any>location.lat,
//     lng: <any>location.lng,
//     address: result.formatted_address,
//   });
// });

// const locationValidation = () => {
//   const client = new Client({});
//   let result = client.geocode({
//     params: {
//       address: '1600 Amphitheatre Parkway, Mountain View, CA',
//       key: 'AIzaSyAfPjiiFC9t-ixMAHY9tqf2YJw19TZ0w0k',
//     },
//   });
//   console.log(result);
// };

// router.get('/made/up', (req: Request, res: Response) => {
//   locationValidation();
//   res.send({});
// });

// const validate = (req: Request,
//   res: Response,
//   next: NextFunction) => {
//   const {year, month, day, hour, min, a} = req.body
//   try{
//     if(!moment(`${year}-${month}-${day} ${hour}:${min} ${a}`,"YYYY-M-D LT", true).isValid()) {
//       throw new Error()
//     }
//     next()
//   } catch(err) {
//     next(err);
//   }
// }

router.post(
  '/api/events',
  requireAuth,
  userValidationRules(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const event = Event.build({
        title,
        description,
        userId: req.currentUser!.id,
      });
      await event.save();
      res.status(201).send(event);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as createEventRouter };
