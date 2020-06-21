import axios from 'axios';
import Router from 'next/router';
import { useState } from 'react';

const JoinIndex = ({ joins }) => {
  const [errors, setErrors] = useState(null);

  const makeRequest = async (join) => {
    try {
      const response = await axios.delete(`/api/joins/${join.post.id}`);
      Router.push('/');
    } catch (err) {
      console.log(err);
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

  return (
    <ul>
      {joins.map((join) => {
        return (
          <div>
            <li key={join.id}>
              <div>
                <h3>{join.post.title}</h3>
                <h6>{join.status}</h6>
                <button
                  onClick={() => {
                    makeRequest(join);
                  }}
                  className="btn btn-primary"
                >
                  Cancel this Join
                </button>
              </div>
            </li>
            {errors}
          </div>
        );
      })}
    </ul>
  );
};

//fetch initial list of joins
JoinIndex.getInitialProps = async (context, axiosClient) => {
  const { data } = await axiosClient.get('/api/joins');
  const joins = data.filter((join) => join.status !== 'cancelled'); //only show the joins that have not been cancelled
  return { joins: joins };
};

export default JoinIndex;
