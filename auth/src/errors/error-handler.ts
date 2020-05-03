import { Request, Response, NextFunction } from 'express';
import { CustomError } from './CustomError';

//middleware that determines what kind of error we received
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //send a consistent error structure to React

  if (err instanceof CustomError) {
    console.log('in the handler!!!!!');
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [
      {
        message: 'something went wrong',
      },
    ],
  });
};
