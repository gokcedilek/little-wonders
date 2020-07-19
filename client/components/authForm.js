import { useState } from 'react';
import useRequest from '../hooks/use-request';

export const AuthForm = ({ data }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: data.url,
    method: data.method,
    body: {
      email,
      password,
    },
    onSuccess: data.onSuccess,
  });

  const onSubmit = async (event) => {
    event.preventDefault(); //prevent form from submitting itself to the browser

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>{data.header}</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
      </div>
      {errors}{' '}
      {/* this variable will only be set if there's an error when making the request */}
      <button className="btn btn-primary">{data.header}</button>
    </form>
  );
};
