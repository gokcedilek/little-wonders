import { ValidationError } from 'express-validator';
import { CustomError } from './CustomError';

//our custom error
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('error invalid request');

    //to extend a built-in class (Error)
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
