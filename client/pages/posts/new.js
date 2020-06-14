import { useState } from 'react'; //keep track of the state of inputs: useState hook in react!
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescr] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/posts',
    method: 'post',
    body: {
      title,
      description,
      price: 10,
      numPeople: 1,
    },
    onSuccess: (post) => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div>
      <h1>Create a Post</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            value={description}
            onChange={(e) => setDescr(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        {/*show at all times, will only be non-empty if there are errors in the request*/}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewPost;
