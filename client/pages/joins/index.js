import axios from 'axios';
import Router from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

const ConfirmedList = ({ confirmed, makeRequest }) => {
  return confirmed.map((join) => {
    return (
      <div class="item">
        <Link href="/posts/[postId]" as={`/posts/${join.post.id}`}>
          <a class="header">{join.post.title}</a>
        </Link>
        <div class="description">
          <a>Details</a>
        </div>
        <div class="ui buttons">
          <button
            class="ui button"
            onClick={() => {
              makeRequest(join);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  });
};

const CreatedList = ({ created, makeRequest }) => {
  return created.map((join) => {
    return (
      <div class="item">
        <Link href="/posts/[postId]" as={`/posts/${join.post.id}`}>
          <a class="header">{join.post.title}</a>
        </Link>
        <div class="description">
          <a>Details</a>
        </div>
        <div class="ui buttons">
          <button
            class="ui button"
            onClick={() => {
              makeRequest(join);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  });
};

const JoinIndex = ({ confirmed, created }) => {
  //used to be "joins"
  const [errors, setErrors] = useState(null);

  const makeRequest = async (join) => {
    try {
      await axios.delete(`/api/joins/${join.post.id}`);
      Router.push('/joins');
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
    <div class="ui two column grid">
      <div class="column">
        <div class="ui raised segment">
          <a class="ui teal ribbon label"></a>
          <span>Confirmed</span>
          <p></p>
          <ConfirmedList confirmed={confirmed} makeRequest={makeRequest} />
        </div>
      </div>
      <div class="column">
        <div class="ui segment">
          <a class="ui orange right ribbon label"></a>
          <span>Created</span>
          <p></p>
          <CreatedList created={created} makeRequest={makeRequest} />
        </div>
      </div>
    </div>
  );
};

//fetch initial list of joins
JoinIndex.getInitialProps = async (context, axiosClient) => {
  const { data } = await axiosClient.get('/api/joins');
  const confirmed = data.filter((join) => join.status === 'confirmed');
  const created = data.filter((join) => join.status === 'created');
  return { confirmed, created };
};

export default JoinIndex;
