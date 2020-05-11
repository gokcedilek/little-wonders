import express, { Request, Response } from 'express';
import { Event } from '../models/event';

const router = express.Router();

router.get('/api/events', async (req: Request, res: Response) => {
  const events = await Event.find({}); //no filtering - all records
  res.send(events).status(200);
});

export { router as indexEventRouter };
