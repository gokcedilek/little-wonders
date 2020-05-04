import axios from 'axios';
import { useState } from 'react';

//custom hook: to make it easy for multiple components to make a request, and get either the response (doRequest returns response.data) or the errors that occurred (doRequest sets the "errors" variable with setErrors)!

//default export means you can name this function to be anything when importing
export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      //before making a new request, clear the errors from before
      setErrors(null);
      //lookup the appropriate request method
      const response = await axios[method](url, body);

      //if the onSuccess callback is provided, call that --> will be executed if the request attempt did not throw an error
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      //set the "errors" to be a descriptive JSX block so that components that use this hook can display the value of the "errors" variable returned from this function easily!
      const errors = err.response.data.errors;
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors }; //return an object
};
