import { CustomError } from './CustomError';

export class NotAuthorizedError extends CustomError {
  statusCode = 401; //user is forbidden

  constructor(message: string) {
    super(message);

    //to extend a built-in class (Error)
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
